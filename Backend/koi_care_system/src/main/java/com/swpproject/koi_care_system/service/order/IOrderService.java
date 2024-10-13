package com.swpproject.koi_care_system.service.order;

import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.models.Order;
import com.swpproject.koi_care_system.payload.request.PlaceOrderRequest;
import com.swpproject.koi_care_system.payload.request.PlacePremiumOrderRequest;

import java.util.List;

public interface IOrderService {
    OrderDto placeOrder(PlaceOrderRequest request);

    OrderDto placePremiumPlanOrder(PlacePremiumOrderRequest request);
    OrderDto getOrder(Long orderId);
    List<OrderDto> getUserOrders(Long userId);

    List<OrderDto> getAllOrders();

    void updateDeliveredStatus(Long orderId);
}