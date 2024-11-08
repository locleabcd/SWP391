package com.swpproject.koi_care_system.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class PaymentDto {
    LocalDateTime createDate;
    Double amount;
    String status;
    String invoiceCode;
    String transactionCode;
    Long orderId;
}
