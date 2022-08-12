package com.aselsan.rehis.radar.rapormodel.config;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.ArrayList;
import java.util.List;

@Configuration
@ConfigurationProperties(prefix = "rapor-model.simulation")
public class ModelConfig {

    private int simulationTrackSize;

    @Bean
    CommandLineRunner commandLineRunner(TrackRepository repository) {
        List<TrackModel> tracks = new ArrayList<>();
        return args -> {
            for (int i = 1; i <= getSimulationTrackSize(); i++) {
                TrackModel student = new TrackModel(
                        (long) i,
                        "AS",
                        30 + i,
                        200 - i,
                        30);
                tracks.add(student);
            }
            repository.saveAll(tracks);
        };
    }

    public int getSimulationTrackSize() {
        return simulationTrackSize;
    }

    public void setSimulationTrackSize(int trackSize) {
        this.simulationTrackSize = trackSize;
    }
}
