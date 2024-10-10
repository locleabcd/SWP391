package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
  List<Order> findByUserId(Long userId);
  Order findByOrderId(Long orderId);
}
