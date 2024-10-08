package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.Category;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Set;

@Data
public class AddProductRequest {
    private String name;
    private String brand;
    private BigDecimal price;
    private int inventory;
    private String description;
    private Category category;
    private Set<Long> issueTypeId;
}
