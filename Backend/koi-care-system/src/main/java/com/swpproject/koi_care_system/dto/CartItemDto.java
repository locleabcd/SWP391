package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.model.Product;

import java.math.BigDecimal;

public class CartItemDto {
    private Long itemId;
    private Integer quantity;
    private BigDecimal unitPrice;
    private ProductDto product;
}
