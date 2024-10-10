package com.swpproject.koi_care_system.payload.request;

import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParametersUpdateRequest {
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
    @NotNull
    long koiPondId;
}