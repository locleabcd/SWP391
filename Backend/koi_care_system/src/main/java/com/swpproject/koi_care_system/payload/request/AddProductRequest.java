package com.swpproject.koi_care_system.payload.request;
import com.swpproject.koi_care_system.models.Category;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class AddProductRequest {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private int inventory;
    private String description;
    private String description_detail;
    private Category category;
    private String supplierName;
}