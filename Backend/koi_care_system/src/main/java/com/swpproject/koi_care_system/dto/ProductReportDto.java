package com.swpproject.koi_care_system.dto;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReportDto {
    Long id;
    String imageUrl;
    String productName;
    String categoryName;
    long quantity;
    Double percent;
    BigDecimal totalPrice;
}
