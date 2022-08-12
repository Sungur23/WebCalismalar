package com.aselsan.rehis.radar.rapormodel.service;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
public class SimulationService {

    private final TrackRepository trackRepository;

    @Autowired
    public SimulationService(TrackRepository trackRepository) {
        this.trackRepository = trackRepository;
    }

    public List<TrackModel> getTracks() {
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


}
