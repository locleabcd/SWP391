package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.payload.request.AddItemToCartRequest;
import com.swpproject.koi_care_system.payload.request.UpdateItemRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.cart.ICartItemService;
import com.swpproject.koi_care_system.service.cart.ICartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RequiredArgsConstructor
@RestController
@RequestMapping("/cartItems")
public class CartItemController {
    private final ICartItemService cartItemService;
    private final ICartService cartService;
    @PostMapping("/item/add")
    public ResponseEntity<ApiResponse> addItemToCart(@RequestBody @Valid AddItemToCartRequest request) {
        try {
            cartItemService.addItemToCart(request.getCartId(), request.getProductId(), request.getQuantity());
            return ResponseEntity.ok(new ApiResponse("Add Item Success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }
    @DeleteMapping("/cart/{cartId}/product/{productId}/remove")
    public ResponseEntity<ApiResponse> removeItemFromCart(@PathVariable Long cartId, @PathVariable Long productId) {
        try {
            cartItemService.removeItemFromCart(cartId, productId);
            return ResponseEntity.ok(new ApiResponse("Remove Item Success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }
    }

    @PutMapping("/cart/{cartId}/product/{productId}/update")
    public  ResponseEntity<ApiResponse> updateItemQuantity(@PathVariable Long cartId,
                                                           @PathVariable Long productId,
                                                           @RequestBody @Valid UpdateItemRequest request) {
        try {
            cartItemService.updateItemQuantity(cartId, productId, request.getQuantity());
            return ResponseEntity.ok(new ApiResponse("Update Item Success", null));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(NOT_FOUND).body(new ApiResponse(e.getMessage(), null));
        }

    }
}
