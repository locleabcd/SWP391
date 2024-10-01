package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WaterParameters {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    LocalDateTime createDateTime;
    double nitrite;
    double nitrate;  // NO3
    double phosphate; // PO4
    double ammonium;  // NH4
    double hardness;  // GH
    double oxygen;    // O2
    double temperature;
    double phValue;
    double carbonHardness;  // KH
    double carbonDioxide;  // CO2
    double salt;
    double totalChlorine;
    double temp;
    double amountFed;
    String note;
    @ManyToOne
    @JoinColumn(name = "koiPond_id")
    KoiPond koiPond;
}