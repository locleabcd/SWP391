package com.swpproject.koi_care_system.service.payment;

import com.swpproject.koi_care_system.dto.PaymentDto;
import com.swpproject.koi_care_system.enums.OrderStatus;
import com.swpproject.koi_care_system.mapper.PaymentMapper;
import com.swpproject.koi_care_system.models.Order;
import com.swpproject.koi_care_system.models.Payment;
import com.swpproject.koi_care_system.payload.request.PaymentStoreRequest;
import com.swpproject.koi_care_system.repository.OrderRepository;
import com.swpproject.koi_care_system.repository.PaymentRepository;
import com.swpproject.koi_care_system.service.subscribe.SubscribePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PaymentService implements IPaymentService {

    private final PaymentMapper paymentMapper;
    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final SubscribePlanService service;
    @Override
    public PaymentDto storePayment(PaymentStoreRequest request) {
        Payment payment = paymentMapper.mapToPayment(request);
        Order order = orderRepository.findByOrderId(request.getOrderId());
        if(request.getStatus().equals("00")){
            order.setOrderStatus(OrderStatus.PROCESSING);
            payment.setStatus("COMPLETED");
            service.upgradePremiumAuto(order);
        }
        else{
            payment.setStatus("CANCELLED");
            order.setOrderStatus(OrderStatus.CANCELLED);
        }
        orderRepository.save(order);
        payment.setOrder(order);
        return paymentMapper.mapToDto(paymentRepository.save(payment));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public List<PaymentDto> getAllPayment() {
        return paymentRepository.findAll().stream().map(paymentMapper::mapToDto).collect(Collectors.toList());
    }

    @Override
    public List<PaymentDto> getAllPaymentByUserId(Long userId) {
        List<Order> orderDtoList = orderRepository.findByUserId(userId);
        List<PaymentDto> paymentDtoList = new ArrayList<>();
        orderDtoList.forEach(order -> {
            paymentDtoList.addAll(paymentRepository.findPaymentsByOrder_OrderId(order.getOrderId()).stream().map(paymentMapper::mapToDto).toList());
        });
        return paymentDtoList;
    }
}
