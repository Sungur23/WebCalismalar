package com.aselsan.rehis.radar.rapormodel.service;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

@Service
public class SimulationService {

    private final TrackRepository trackRepository;
    private List<TrackModel> model;

    @Autowired
    public SimulationService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
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

                double azimuth = track.getAzimuth();
                if (azimuth >= 50) {
                    azimuth = -50;
                }
                track.setAzimuth(azimuth + 0.04);

                double range = track.getRange();
                if (range >= 1000) {
                    range = 0;
                }
                track.setRange(range + 0.3);
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
