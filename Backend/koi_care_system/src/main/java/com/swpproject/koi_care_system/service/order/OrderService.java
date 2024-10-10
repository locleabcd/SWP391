package com.swpproject.koi_care_system.service.order;

import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.enums.OrderStatus;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.OrderMapper;
import com.swpproject.koi_care_system.models.Cart;
import com.swpproject.koi_care_system.models.Order;
import com.swpproject.koi_care_system.models.OrderItem;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.payload.request.PlaceOrderRequest;
import com.swpproject.koi_care_system.repository.OrderRepository;
import com.swpproject.koi_care_system.repository.ProductRepository;
import com.swpproject.koi_care_system.service.cart.CartService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService implements IOrderService {
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CartService cartService;
    private final OrderMapper orderMapper;

    @Transactional
    @Override
    public OrderDto placeOrder(PlaceOrderRequest request) {
        Cart cart   = cartService.getCartByUserId(request.getUserId());
        Order order = createOrder(cart);
        List<OrderItem> orderItemList = createOrderItems(order, cart);
        order.setAddress(request.getAddress());
        order.setPhone(request.getPhone());
        order.setRecipientName(request.getRecipientName());
        order.setNote(request.getNote());
        order.setOrderItems(new HashSet<>(orderItemList));
        order.setTotalAmount(calculateTotalAmount(orderItemList));
        Order savedOrder = orderRepository.save(order);
        cartService.clearCart(cart.getId());
        return orderMapper.toDto(savedOrder);
    }

    private Order createOrder(Cart cart) {
        Order order = new Order();
        order.setUser(cart.getUser());
        order.setOrderStatus(OrderStatus.PENDING);
        order.setOrderDate(LocalDate.now());
        return  order;
    }

    private List<OrderItem> createOrderItems(Order order, Cart cart) {
        return  cart.getItems().stream().map(cartItem -> {
            Product product = cartItem.getProduct();
            product.setInventory((product.getInventory() - cartItem.getQuantity()));
            if(product.getInventory()==0)
                product.setStatus(false);
            productRepository.save(product);
            return  new OrderItem(
                    order,
                    product,
                    cartItem.getQuantity(),
                    cartItem.getUnitPrice());
        }).toList();
    }

    private BigDecimal calculateTotalAmount(List<OrderItem> orderItemList) {
        return  orderItemList
                .stream()
                .map(item -> item.getPrice()
                        .multiply(new BigDecimal(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Override
    public OrderDto getOrder(Long orderId) {
        return orderRepository.findById(orderId)
                .map(orderMapper::toDto)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found"));
    }

    @Override
    public List<OrderDto> getUserOrders(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return  orders.stream().map(orderMapper :: toDto).toList();
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void updateDeliveredStatus(Long orderId) {
        Order order = orderRepository.findByOrderId(orderId);
        order.setOrderStatus(OrderStatus.DELIVERED);
        orderRepository.save(order);
    }

}