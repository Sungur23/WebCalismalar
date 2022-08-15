package com.aselsan.rehis.radar.rapormodel.endpoint;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.service.SimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "api/v1/simulation")
public class SimulationController {

    private final SimulationService simulationService;

    @Autowired
    public SimulationController(SimulationService simulationService) {
        this.simulationService = simulationService;
    }


    @GetMapping(path = "tracks")
    public List<TrackModel> getTracks() {
        return simulationService.getTracks();
    }

    @PostMapping(path = "{addTrack}")
    public void registerNewTrack(@RequestBody TrackModel track) {
        simulationService.addNewTrack(track);
    }

    @DeleteMapping(path = "delTrack/{trackId}")
    public void deleteTrack(
            @PathVariable("trackId") Long trackId) {
        simulationService.deleteTrack(trackId);
    }

    @PutMapping(path = "putTrack/{trackId}")
    public void updateTrack(
            @PathVariable("trackId") Long trackId,
            @RequestParam(required = true) String type,
            @RequestParam(required = true) double azimuth,
            @RequestParam(required = true) double range,
            @RequestParam(required = true) double elevation) {

        simulationService.updateTrack(trackId, type, azimuth, range, elevation);
    }
}
