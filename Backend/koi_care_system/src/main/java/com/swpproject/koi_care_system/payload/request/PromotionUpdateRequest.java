package com.swpproject.koi_care_system.payload.request;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class PromotionUpdateRequest {
    private String name;
    private Double discountRate;
    private String description;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private List<Long> productIds;
}