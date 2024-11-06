package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment,Long> {
    List<Payment> findPaymentsByOrder_OrderId(Long orderId);

}
