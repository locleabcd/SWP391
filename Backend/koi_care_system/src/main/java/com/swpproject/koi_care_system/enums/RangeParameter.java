package com.swpproject.koi_care_system.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.experimental.FieldDefaults;

@Getter
@AllArgsConstructor
@FieldDefaults(makeFinal = true)
public enum RangeParameter {
    NO2("NO2", 0, 0.1),
    NO3("NO3", 0, 20),
    PO4("PO4", 0, 0.035),
    NH4("NH4", 0, 0.1),
    GH("GH", 0, 21),
    O2("O2", 5, 6.5),
    TEMPERATURE("TEMPERATURE", 5, 26),
    PH("PH", 6.9, 8),
    KH("KH", 4, 12),
    CO2("CO2", 5, 35),
    SALT("SALT", 0, 0.1),
    CHLORINE("CHLORINE", 0, 0.001),
    OUTDOORTEMP("OUTDOORTEMP", -40, 40),
    ;

    private String name;
    private double lowValue;
    private double highValue;

    public boolean isLow(double value) {
        return value < lowValue;
    }

    public boolean isHigh(double value) {
        return value > highValue;
    }
}