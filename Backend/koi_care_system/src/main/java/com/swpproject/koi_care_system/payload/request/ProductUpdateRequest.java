package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.Category;
import com.swpproject.koi_care_system.models.Supplier;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductUpdateRequest {
    private Long id;
    private String brand;
    private String name;
    private BigDecimal price;
    private int inventory;
    private String description;
    private Category category;
    private String supplierName;
}
