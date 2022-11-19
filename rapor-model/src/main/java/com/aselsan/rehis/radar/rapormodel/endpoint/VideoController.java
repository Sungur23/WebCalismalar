package com.aselsan.rehis.radar.rapormodel.endpoint;

import com.aselsan.rehis.radar.rapormodel.model.PPILineModel;
import com.aselsan.rehis.radar.rapormodel.service.VideoSimulationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping(path = "api/v1/simulation/video")
public class VideoController {

    private final VideoSimulationService videoSimulationService;

    @Autowired
    public VideoController(VideoSimulationService videoSimulationService) {
        this.videoSimulationService = videoSimulationService;
    }

    @GetMapping(path = "video/{lineID}")
    public PPILineModel getPPILine(@PathVariable("lineID") int lineID) {
        return videoSimulationService.getModelWithLineID(lineID);
    }

}
