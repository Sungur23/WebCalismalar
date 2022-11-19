package com.aselsan.rehis.radar.rapormodel.simulation;

import com.aselsan.rehis.radar.rapormodel.model.PPILineModel;
import com.aselsan.rehis.radar.rapormodel.utils.ImgUtils;
import lombok.Getter;
import org.springframework.stereotype.Component;

import java.awt.image.BufferedImage;
import java.util.List;

@Component
@Getter
public class VideoSimulation {

    private BufferedImage simImage;
    private List<PPILineModel> model;

    public VideoSimulation() {

        this.simImage = ImgUtils.imajYukle("bulut2.png");
        this.model = ImgUtils.generetaModelFromImage(this.simImage);
    }

    public PPILineModel getModelFromLineID(int lineID) {
        if (model != null && !model.isEmpty() && model.size() > lineID) {
            return model.get(lineID);
        } else {
            return null;
        }
    }

    public int getModelSize() {
        return model != null ? model.size() : 0;
    }
}
