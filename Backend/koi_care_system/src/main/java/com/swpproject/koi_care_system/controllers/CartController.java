package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.CartDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.Cart;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.cart.ICartService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/carts")
public class CartController {
    private final ICartService cartService;

    @GetMapping("/cart/{cartId}/my-cart")
    public ResponseEntity<ApiResponse> getCart( @PathVariable Long cartId) {
        try {
            CartDto cart = cartService.getCartDto(cartId);
            return ResponseEntity.ok(new ApiResponse("Success", cart));
        } catch (ResourceNotFoundException e) {
          return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @DeleteMapping("/cart/{cartId}/clear")
    public ResponseEntity<ApiResponse> clearCart( @PathVariable Long cartId) {
        try {
            cartService.clearCart(cartId);
            return ResponseEntity.ok(new ApiResponse("Clear Cart Success!", null));
        } catch (ResourceNotFoundException e) {
          return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @GetMapping("/cart/{cartId}/total-price")
    public ResponseEntity<ApiResponse> getTotalAmount( @PathVariable Long cartId) {
        try {
            BigDecimal totalPrice = cartService.getTotalPrice(cartId);
            return ResponseEntity.ok(new ApiResponse("Total Price", totalPrice));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @GetMapping("/user/{userId}/cartId")
    public ResponseEntity<ApiResponse> getCartIdByUserId(@PathVariable Long userId){
        Long cartId;
        if(cartService.getCartByUserId(userId)==null)
            cartId=cartService.initializeNewCart(userId);
        else
            cartId=cartService.getCartByUserId(userId).getId();
        return  ResponseEntity.ok(new ApiResponse("CartId found!", cartId));
    }

}
