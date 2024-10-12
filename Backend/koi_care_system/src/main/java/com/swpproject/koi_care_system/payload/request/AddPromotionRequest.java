package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AddPromotionRequest {
    private String name;
    private Double discountRate;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
}