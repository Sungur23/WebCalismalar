package com.aselsan.rehis.radar.rapormodel.model;

import lombok.*;

import javax.persistence.*;
import java.util.List;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PPILineModel {

    private int lineId;
    private int[] rgbArray;

}
