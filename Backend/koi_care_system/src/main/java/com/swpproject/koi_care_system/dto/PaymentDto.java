package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.OrderStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PaymentDto {
    private LocalDateTime createDate;
    private Long amount;
    private String status;
    private String invoiceCode;
    private String transactionCode;
    private Long orderId;
}
