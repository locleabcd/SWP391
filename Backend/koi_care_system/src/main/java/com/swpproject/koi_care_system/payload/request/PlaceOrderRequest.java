package com.swpproject.koi_care_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PlaceOrderRequest {
    private Long userId;
    private String address;
    private String phone;
    private String recipientName;
}
