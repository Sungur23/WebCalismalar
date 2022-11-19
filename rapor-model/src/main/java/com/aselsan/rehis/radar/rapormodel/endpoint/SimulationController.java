package com.aselsan.rehis.radar.rapormodel.endpoint;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.service.TrackSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "api/v1/simulation/track")
public class SimulationController {

    private final TrackSimulationService trackSimulationService;

    @Autowired
    public SimulationController(TrackSimulationService trackSimulationService) {
        this.trackSimulationService = trackSimulationService;
    }

    @PostMapping(path = "state")
    public void setSimulationState(@RequestBody Boolean state) {
        trackSimulationService.setState(state);
    }

    @GetMapping(path = "tracks")
    public List<TrackModel> getTracks() {
        return trackSimulationService.getTracks();
    }

    @PostMapping(path = "{addTrack}")
    public void registerNewTrack(@RequestBody TrackModel track) {
        trackSimulationService.addNewTrack(track);
    }

    @DeleteMapping(path = "delTrack/{trackId}")
    public void deleteTrack(
            @PathVariable("trackId") Long trackId) {
        trackSimulationService.deleteTrack(trackId);
    }

    @PutMapping(path = "putTrack/{trackId}")
    public void updateTrack(
            @PathVariable("trackId") Long trackId,
            @RequestParam(required = true) String type,
            @RequestParam(required = true) double azimuth,
            @RequestParam(required = true) double range,
            @RequestParam(required = true) double elevation) {

        trackSimulationService.updateTrack(trackId, type, azimuth, range, elevation);
    }
}
