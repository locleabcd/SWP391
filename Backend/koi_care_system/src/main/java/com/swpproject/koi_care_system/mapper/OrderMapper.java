package com.swpproject.koi_care_system.mapper;

import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.models.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {OrderItemMapper.class})
public interface OrderMapper {

    @Mapping(target = "id", source = "orderId")
    @Mapping(target = "userId", source = "user.id")
    @Mapping(target = "orderDate", expression = "java(order.getOrderDate() != null ? order.getOrderDate().atStartOfDay() : null)")
    @Mapping(target = "status", source = "orderStatus")
    @Mapping(target = "items", source = "orderItems")
    OrderDto toDto(Order order);

    @Mapping(target = "orderId", source = "id")
    @Mapping(target = "user.id", source = "userId")
    @Mapping(target = "orderDate", expression = "java(orderDto.getOrderDate() != null ? orderDto.getOrderDate().toLocalDate() : null)")
    @Mapping(target = "orderStatus", source = "status")
    @Mapping(target = "orderItems", source = "items")
    Order toEntity(OrderDto orderDto);
}
