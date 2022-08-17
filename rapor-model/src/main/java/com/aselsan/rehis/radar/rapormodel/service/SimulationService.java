package com.aselsan.rehis.radar.rapormodel.service;

import com.aselsan.rehis.radar.rapormodel.config.ModelConfig;
import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.*;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class SimulationService {

    private final TrackRepository trackRepository;
    private final ModelConfig modelConfig;
    private List<TrackModel> model;


    private List<Boolean> yonYancaList;
    private List<Boolean> yonRangeList;
    private static final int MIN_YANCA = -50;
    private static final int MAX_YANCA = 50;
    private static final int MAX_RANGE = 1000;
    private static final double azmDiff = 0.05;
    private static final double rangeDiff = 0.5;

    @Autowired
    public SimulationService(TrackRepository trackRepository, ModelConfig modelConfig) {
        this.trackRepository = trackRepository;
        this.modelConfig = modelConfig;

        Random r = new Random();

        yonYancaList = new ArrayList<Boolean>();
        yonRangeList = new ArrayList<Boolean>();

        for (int i = 0; i < modelConfig.getSimulationTrackSize(); i++) {
            yonYancaList.add(r.nextBoolean());
            yonRangeList.add(r.nextBoolean());
        }
    }

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

    public List<TrackModel> getTracks() {
//        trackRepository.saveAll(model);
//        return trackRepository.findAll();
        return model;
    }

    @Bean
    public void trackUpdate() {

        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(() -> {

            if (model == null || model.size() == 0)
                model = trackRepository.findAll();
            for (TrackModel track : model) {

                try {
                    move(track);
                } catch (Exception e) {
                    e.printStackTrace();
                }
//                double azimuth = track.getAzimuth();
//                if (azimuth >= 50) {
//                    azimuth = -50;
//                }
//                track.setAzimuth(azimuth + 0.04);
//
//                double range = track.getRange();
//                if (range >= 1000) {
//                    range = 0;
//                }
//                track.setRange(range + 0.3);
//            System.out.println(track.toString());
            }
        }, 0, 10, TimeUnit.MILLISECONDS);
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


}
