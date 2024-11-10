package com.swpproject.koi_care_system.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
public class PromotionDto {
    private Long id;
    private String name;
    private Double discountRate;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
}