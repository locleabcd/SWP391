package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.PaymentDto;
import com.swpproject.koi_care_system.service.vnpay.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/payment")
@RequiredArgsConstructor
public class PaymentController {
    private final VnPayService paymentService;

    @GetMapping("/vn-pay")
    public ResponseEntity<PaymentDto> pay(HttpServletRequest request) {
        return new ResponseEntity<>(paymentService.createVnPayPayment(request), HttpStatus.OK);
    }

    @GetMapping("/vn-pay-callback")
    public ResponseEntity<PaymentDto> payCallbackHandler(HttpServletRequest request) {
        String status = request.getParameter("vnp_ResponseCode");
        if ("00".equals(status)) {
            return ResponseEntity.ok(PaymentDto.builder()
                    .message("Success")
                    .build());
        } else {
            return ResponseEntity.badRequest().body(PaymentDto.builder()
                    .message("Failed")
                    .build());
        }
    }
}
