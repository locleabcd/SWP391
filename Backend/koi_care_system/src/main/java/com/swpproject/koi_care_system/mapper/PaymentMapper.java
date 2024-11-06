package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.PaymentDto;
import com.swpproject.koi_care_system.models.Payment;
import com.swpproject.koi_care_system.payload.request.PaymentStoreRequest;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PaymentMapper {
    @Mapping(target = "orderId", source = "order.orderId")
    PaymentDto mapToDto(Payment payment);

    @Mapping(target = "order", ignore = true)
    @Mapping(target = "id", ignore = true)
    Payment mapToPayment(PaymentStoreRequest request);
}
