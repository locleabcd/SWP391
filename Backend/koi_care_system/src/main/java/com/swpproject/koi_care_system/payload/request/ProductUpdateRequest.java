package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.Category;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class ProductUpdateRequest {
    private Long id;
    private String brand;
    private String name;
    private BigDecimal price;
    private int inventory;
    private String description;
    private String description_detail;
    private Category category;
    private String supplierName;
    private Set<Long> issueTypeId;
}