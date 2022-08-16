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
import java.util.Random;

@Configuration
@ConfigurationProperties(prefix = "rapor-model.simulation")
public class ModelConfig {

    private int simulationTrackSize;

    @Bean
    CommandLineRunner commandLineRunner(TrackRepository repository) {
        List<TrackModel> tracks = new ArrayList<>();
        Random r = new Random();
        return args -> {
            for (int i = 1; i <= getSimulationTrackSize(); i++) {
                TrackModel student = new TrackModel(
                        (long) i,
                        "AS",
                        -50 + (50 - (-50)) * r.nextDouble(),
                        0 + (1000 - (0)) * r.nextDouble(),
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
