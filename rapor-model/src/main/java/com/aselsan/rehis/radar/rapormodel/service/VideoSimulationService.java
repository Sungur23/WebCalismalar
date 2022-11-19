package com.aselsan.rehis.radar.rapormodel.service;

import com.aselsan.rehis.radar.rapormodel.config.ModelConfig;
import com.aselsan.rehis.radar.rapormodel.model.PPILineModel;
import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import com.aselsan.rehis.radar.rapormodel.simulation.VideoSimulation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Service
public class VideoSimulationService {

    private final ModelConfig modelConfig;
    private final VideoSimulation videoSimulation;

    @Autowired
    public VideoSimulationService(ModelConfig modelConfig, VideoSimulation videoSimulation) {
        this.modelConfig = modelConfig;
        this.videoSimulation = videoSimulation;
    }

    //region video service functions
    public PPILineModel getModelWithLineID(int lineID) {
        return this.videoSimulation.getModelFromLineID(lineID);
    }
}
