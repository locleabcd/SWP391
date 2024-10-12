package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.dto.PaymentDto;
import com.swpproject.koi_care_system.dto.VnPayDto;
import com.swpproject.koi_care_system.enums.OrderStatus;
import com.swpproject.koi_care_system.payload.request.PaymentStoreRequest;
import com.swpproject.koi_care_system.payload.response.ApiResponse;
import com.swpproject.koi_care_system.service.payment.IPaymentService;
import com.swpproject.koi_care_system.service.vnpay.VnPayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.net.URI;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

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
    @GetMapping("/vn-pay/order")
    public ResponseEntity<VnPayDto> payForOrder(HttpServletRequest request){
        return new ResponseEntity<>(vnPayService.createVnPayPaymentViaOrderId(request),HttpStatus.OK);
    }
    @RequestMapping("vn-pay-return")
    public ResponseEntity<Void> payResponse(HttpServletRequest request){
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMddHHmmss");
        PaymentDto payment = paymentService.storePayment(PaymentStoreRequest.builder()
                        .createDate(LocalDateTime.parse(request.getParameter("vnp_PayDate"),formatter))
                        .amount(Long.parseLong(request.getParameter("vnp_Amount")))
                        .status(request.getParameter("vnp_ResponseCode"))
                        .invoiceCode(request.getParameter("vnp_TxnRef"))
                        .transactionCode(request.getParameter("vnp_TransactionNo"))
                        .orderId(Long.parseLong(
                                request.getParameter("vnp_OrderInfo")
                                        .split(" ")[request.getParameter("vnp_OrderInfo").split(" ").length - 1]
                                        .trim()))
                        .build());
        if (payment.getStatus().equals("COMPLETED")) {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("https://koi-care-system.vercel.app/member/paymentSuccess"))
                    .build();
        } else {
            return ResponseEntity.status(HttpStatus.FOUND)
                    .location(URI.create("https://koi-care-system.vercel.app/member/paymentError"))
                    .build();
        }
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