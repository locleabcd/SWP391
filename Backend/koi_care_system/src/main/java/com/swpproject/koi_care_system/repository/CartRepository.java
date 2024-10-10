package com.swpproject.koi_care_system.repository;
import com.swpproject.koi_care_system.models.Cart;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {
    Cart findByUserId(Long userId);
}