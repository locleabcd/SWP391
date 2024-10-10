package com.swpproject.koi_care_system.payload.request;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentStoreRequest {
    private LocalDateTime createDate;
    private Double amount;
    private String status;
    private String invoiceCode;
    private String transactionCode;
    private Long orderId;
}
