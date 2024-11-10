package com.swpproject.koi_care_system.payload.request;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class PaymentStoreRequest {
    private LocalDateTime createDate;
    private Long amount;
    private String status;
    private String invoiceCode;
    private String transactionCode;
    private Long orderId;
}
