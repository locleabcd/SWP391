package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

@Data
public class AddItemToCartRequest {
    private Long cartId;
    private Long productId;
    private int quantity;
}
