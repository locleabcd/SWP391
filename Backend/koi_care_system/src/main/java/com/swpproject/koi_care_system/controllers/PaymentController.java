package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.VnPayDto;
import com.swpproject.koi_care_system.payload.request.PaymentStoreRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.payment.IPaymentService;
import com.swpproject.koi_care_system.service.vnpay.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final VnPayService vnPayService;
    private final IPaymentService paymentService;
    @GetMapping("/vn-pay")
    public ResponseEntity<VnPayDto> pay(HttpServletRequest request) {
        return new ResponseEntity<>(vnPayService.createVnPayPayment(request), HttpStatus.OK);
    }
    @PostMapping("/vn-response")
    public ResponseEntity<ApiResponse> storePayment(@RequestBody @Valid PaymentStoreRequest request){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Store successful")
                .data(paymentService.storePayment(request))
                .build());
    }
    @GetMapping("/all")
    public ResponseEntity<ApiResponse> getAllPayment(){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Get successful")
                .data(paymentService.getAllPayment())
                .build());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getPaymentsByUserId(@PathVariable Long userId){
        return ResponseEntity.ok(ApiResponse.builder()
                .message("Get successful")
                .data(paymentService.getAllPaymentByUserId(userId))
                .build());
    }


}