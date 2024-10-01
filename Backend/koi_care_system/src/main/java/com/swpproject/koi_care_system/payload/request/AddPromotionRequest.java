package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

import java.time.LocalDate;

@Data
public class AddPromotionRequest {
    private Long id;
    private String name;
    private Double discountRate;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}