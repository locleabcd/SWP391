package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.enums.PromotionStatus;
import lombok.Data;
import java.time.LocalDate;

@Data
public class PromotionUpdateRequest {
    private Long id;
    private String name;
    private Double discountRate;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private PromotionStatus status;
}