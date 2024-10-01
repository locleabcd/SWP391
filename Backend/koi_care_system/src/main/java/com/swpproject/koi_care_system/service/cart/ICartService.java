package com.swpproject.koi_care_system.service.cart;

import com.swpproject.koi_care_system.dto.CartDto;
import com.swpproject.koi_care_system.models.Cart;

import java.math.BigDecimal;

public interface ICartService {
    Cart getCart(Long id);
    CartDto getCartDto(Long id);
    void clearCart(Long id);
    BigDecimal getTotalPrice(Long id);

    Long initializeNewCart(Long userId);

    Cart getCartByUserId(Long userId);
}
