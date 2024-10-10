package com.swpproject.koi_care_system.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class PromotionDto {
    private Long id;
    private String name;
    private Double discountRate;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
}