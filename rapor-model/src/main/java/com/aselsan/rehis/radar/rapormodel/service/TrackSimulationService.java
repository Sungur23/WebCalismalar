package com.aselsan.rehis.radar.rapormodel.service;

import com.aselsan.rehis.radar.rapormodel.config.ModelConfig;
import com.aselsan.rehis.radar.rapormodel.model.PPILineModel;
import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import com.aselsan.rehis.radar.rapormodel.simulation.VideoSimulation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class TrackSimulationService {

    private static final int MIN_YANCA = -50;
    private static final int MAX_YANCA = 50;
    private static final int MAX_RANGE = 1000;
    private static final double azmDiff = 0.05;
    private static final double rangeDiff = 0.5;
    private final TrackRepository trackRepository;
    private final ModelConfig modelConfig;
    private final VideoSimulation videoSimulation;
    private List<TrackModel> model;
    private List<Boolean> yonYancaList;
    private List<Boolean> yonRangeList;
    private ScheduledExecutorService scheduledExecutorService;
    private Boolean simulationState = false;
    private Runnable trackSimulation = () -> {

        List<TrackModel> tracks = getTracks();
        for (TrackModel track : tracks) {
            try {
                move(track);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    };
    @Autowired
    public TrackSimulationService(TrackRepository trackRepository, ModelConfig modelConfig, VideoSimulation videoSimulation) {
        this.trackRepository = trackRepository;
        this.modelConfig = modelConfig;
        this.videoSimulation = videoSimulation;

        this.scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();

        Random r = new Random();

        yonYancaList = new ArrayList<Boolean>();
        yonRangeList = new ArrayList<Boolean>();

        for (int i = 0; i < modelConfig.getSimulationTrackSize(); i++) {
            yonYancaList.add(r.nextBoolean());
            yonRangeList.add(r.nextBoolean());
        }
    }

    //region track move simulation
    private void move(TrackModel track) {

        int index = track.getId().intValue() - 1;
        if (yonYancaList.get(index)) {
            track.setAzimuth(track.getAzimuth() - azmDiff);
            if (track.getAzimuth() <= MIN_YANCA) {
                yonYancaList.set(index, false);
                track.setAzimuth(track.getAzimuth() + azmDiff);
            }
        } else {
            track.setAzimuth(track.getAzimuth() + azmDiff);
            if (track.getAzimuth() >= MAX_YANCA) {
                yonYancaList.set(index, true);
                track.setAzimuth(track.getAzimuth() - azmDiff);
            }
        }

        if (yonRangeList.get(index)) {
            track.setRange(track.getRange() - rangeDiff);
            if (track.getRange() <= 0) {
                yonRangeList.set(index, false);
                track.setRange(track.getRange() + rangeDiff);
            }
        } else {
            track.setRange(track.getRange() + rangeDiff);
            if (track.getRange() >= MAX_RANGE) {
                yonRangeList.set(index, true);
                track.setRange(track.getRange() - rangeDiff);
            }
        }
    }

    public void setState(Boolean state) {

        if (state) {

            if (!this.simulationState) {
                if (model == null || model.size() == 0)
                    model = trackRepository.findAll();
                scheduledExecutorService = Executors.newSingleThreadScheduledExecutor();
                scheduledExecutorService.scheduleAtFixedRate(
                        trackSimulation,
                        0,
                        10,
                        TimeUnit.MILLISECONDS);
//                scheduledExecutorService.submit(trackSimulation);
            }
        } else {
            scheduledExecutorService.shutdown();
            if (model != null) {
                trackRepository.saveAll(model);
            }
        }

        this.simulationState = state;
    }
    //endregion

    //region track service functions
    public List<TrackModel> getTracks() {
//        trackRepository.saveAll(model);
//        return trackRepository.findAll();
//        return model;
        if (!simulationState && model != null) {
            model.clear();
        }
        return model;
    }

    public List<TrackModel> getTracksfromDB() {
        return trackRepository.findAll();
    }

    public void addNewTrack(TrackModel track) {
        Optional<TrackModel> trackOptional = trackRepository
                .findById(track.getId());
        if (trackOptional.isPresent()) {
            throw new IllegalStateException("track id taken");
        }
        trackRepository.save(track);
    }

    public void deleteTrack(Long trackId) {
        boolean exist = trackRepository.existsById(trackId);
        if (exist) {
            trackRepository.deleteById(trackId);
        } else {
            throw new IllegalStateException("track with id:" + trackId + " does not exist");
        }
    }

    @Transactional
    public void updateTrack(Long trackId, String type, double azimuth, double range, double elevation) {

        TrackModel track = trackRepository.findById(trackId)
                .orElseThrow(() -> new IllegalStateException(
                        "track with id:" + trackId + " does not exist"));

        track.setType(type);
        track.setAzimuth(azimuth);
        track.setRange(range);
        track.setElevation(elevation);
    }
    //endregion

    //region video service functions
    public PPILineModel getModelWithLineID(int lineID) {
        return this.videoSimulation.getModelFromLineID(lineID);
    }
    //endregion
}
