package com.aselsan.rehis.radar.rapormodel.model;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class TrackModel {

    @Id
    @SequenceGenerator(
            name = "trackmodel_sequence",
            sequenceName = "trackmodel_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "trackmodel_sequence"
    )
    private Long id;
    private String type;
    private double azimuth;
    private double range;
    private double elevation;

//    @Transient
//    private Integer age; //Veri tabanina eklenmiyor sadece sinif icinde kullaniliyor.

}
