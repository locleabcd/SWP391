package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.models.Category;
import com.swpproject.koi_care_system.models.Supplier;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductDto {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private int inventory;
    private String description;
    private Category category;
    private Supplier supplier;
    private List<ImageDto> images;
    private List<PromotionDto> promotions;
    private Double rating;

}
