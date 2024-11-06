package com.swpproject.koi_care_system.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemDto {
    private Long productId;
    private String productName;
    private Long quantity;
    private BigDecimal price;
    private String imageUrl;
    private String category;
}