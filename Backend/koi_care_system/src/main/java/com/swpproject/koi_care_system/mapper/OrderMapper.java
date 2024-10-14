package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.models.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "id", source = "orderId")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "status", source = "orderStatus")
    @Mapping(target = "items", source = "orderItems")
    OrderDto toDto(Order order);
}