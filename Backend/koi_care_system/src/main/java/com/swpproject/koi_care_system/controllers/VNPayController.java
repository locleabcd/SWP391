package com.swpproject.koi_care_system.controllers;

import com.swpproject.koi_care_system.service.payment.VNPayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/payment")
public class VNPayController {

    @Autowired
    private VNPayService vnpayService;

    @GetMapping("/create")
    public String createPayment(@RequestParam("amount") Long amount, @RequestParam("orderId") String orderId) throws Exception {
        String paymentUrl = vnpayService.createPaymentUrl(amount, orderId);
        return "redirect:" + paymentUrl;
    }

    @GetMapping("/vnpay_return")
    public String handleVNPayReturn(@RequestParam Map<String, String> params) {
        // Xử lý thông tin trả về từ VNPay tại đây
        return "Payment result received!";
    }
}

