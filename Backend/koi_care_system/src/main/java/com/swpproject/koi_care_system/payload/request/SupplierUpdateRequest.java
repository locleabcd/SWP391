package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

@Data
public class SupplierUpdateRequest {
    private String name;

    private String phone;

    private String address;
}