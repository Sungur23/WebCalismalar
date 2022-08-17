package com.aselsan.rehis.radar.rapormodel.config;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;
import com.aselsan.rehis.radar.rapormodel.repository.TrackRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.lang.reflect.Array;
import java.time.LocalDate;
import java.time.Month;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Configuration
@ConfigurationProperties(prefix = "rapor-model.simulation")
public class ModelConfig {

    private int simulationTrackSize;

    @Bean
    CommandLineRunner commandLineRunner(TrackRepository repository) {


        return args -> {
            Random r = new Random();
            long time = System.currentTimeMillis();
            int minRange = 0, max_range = 1000, min_azm = -50, max_azm = 50;

            List<TrackModel> tracks = Stream.iterate(1, x -> x + 1)
                    .parallel()
                    .map(i -> {
                        return new TrackModel(
                                (long) i,
                                "AS",
                                min_azm + (max_azm - min_azm) * r.nextDouble(),
                                minRange + (max_range - minRange) * r.nextDouble(),
                                min_azm + (max_azm - min_azm) * r.nextDouble());
                    })
                    .limit(getSimulationTrackSize())
                    .collect(Collectors.toList());

            long generatedTime = System.currentTimeMillis();
            System.err.println("Simulation objects generate time (ms): " + (generatedTime - time));
            repository.saveAll(tracks);
            long savedTime = System.currentTimeMillis();
            System.err.println("Simulation objects db save time (ms): " + (savedTime - generatedTime));
        };


    }

    public int getSimulationTrackSize() {
        return simulationTrackSize;
    }

    public void setSimulationTrackSize(int trackSize) {
        this.simulationTrackSize = trackSize;
    }
}
