package com.swpproject.koi_care_system.controllers;
import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.payload.request.PlaceOrderRequest;
import com.swpproject.koi_care_system.payload.request.PlacePremiumOrderRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.order.IOrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/orders")
public class OrderController {
    private final IOrderService orderService;

    @PostMapping("/order")
    public ResponseEntity<ApiResponse> createOrder(@RequestBody @Valid PlaceOrderRequest request) {
        try {
            OrderDto order =  orderService.placeOrder(request);
            return ResponseEntity.ok(new ApiResponse("Item Order Success!", order));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Error Occured!", e.getMessage()));
        }
    }

    @PostMapping("/order/premium")
    public ResponseEntity<ApiResponse> placePremiumOrder(@RequestBody @Valid PlacePremiumOrderRequest request){
        try {
            OrderDto order =  orderService.placePremiumPlanOrder(request);
            return ResponseEntity.ok(new ApiResponse("Order premium Success!", order));
        } catch (Exception e) {
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(new ApiResponse("Error Occured!", e.getMessage()));
        }
    }

    @GetMapping("/{orderId}/order")
    public ResponseEntity<ApiResponse> getOrderById(@PathVariable Long orderId){
        try {
            OrderDto order = orderService.getOrder(orderId);
            return ResponseEntity.ok(new ApiResponse("Item Order Success!", order));
        } catch (ResourceNotFoundException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Oops!", e.getMessage()));
        }
    }

    @GetMapping("/user/{userId}/order")
    public ResponseEntity<ApiResponse> getUserOrders(@PathVariable Long userId) {
        try {
            List<OrderDto> order = orderService.getUserOrders(userId);
            return ResponseEntity.ok(new ApiResponse("Get Order Success", order));
        } catch (ResourceNotFoundException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Oops!", e.getMessage()));
        }
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllOrders(){
        try {
            return ResponseEntity.ok(ApiResponse.builder()
                            .message("Get all orders success")
                            .data(orderService.getAllOrders())
                    .build());
        }catch (ResourceNotFoundException e){
            return ResponseEntity.status((HttpStatus.NOT_FOUND)).body(new ApiResponse("Ooops! Not found",e.getMessage()));
        }
    }


    @PutMapping("/{orderId}/order/delivery")
    public ResponseEntity<ApiResponse> updateDelivered(@PathVariable Long orderId) {
        try {
            orderService.updateDeliveredStatus(orderId);
            return ResponseEntity.ok(new ApiResponse("Update order success!",null));
        } catch (ResourceNotFoundException e) {
            return  ResponseEntity.status(HttpStatus.NOT_FOUND).body(new ApiResponse("Oops!", e.getMessage()));
        }
    }
}
