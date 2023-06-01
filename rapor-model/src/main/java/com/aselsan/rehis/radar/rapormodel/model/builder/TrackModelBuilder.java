package com.aselsan.rehis.radar.rapormodel.model.builder;

import com.aselsan.rehis.radar.rapormodel.model.TrackModel;

import java.util.Random;

public class TrackModelBuilder {
    private TrackModel model;

    public TrackModelBuilder(){
        Random random = new Random();

        this.model = new TrackModel();
        this.model.setId(random.nextLong());
        this.model.setType("");
        this.model.setAzimuth(0.0D);
        this.model.setRange(0.0D);
        this.model.setElevation(0.0D);
    }

    public TrackModelBuilder setType(String type){
        this.model.setType(type);
        return this;
    }

    public TrackModelBuilder setAzimuth(double value){
        this.model.setAzimuth(value);
        return this;
    }

    public TrackModelBuilder setRange(double value){
        this.model.setRange(value);
        return this;
    }
    public TrackModelBuilder setElevation(double value){
        this.model.setElevation(value);
        return this;
    }

    public TrackModel build(){
        return model;
    }
}
