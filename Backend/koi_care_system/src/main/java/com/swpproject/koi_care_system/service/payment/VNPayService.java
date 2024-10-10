package com.swpproject.koi_care_system.service.payment;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.*;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class VNPayService {

    @Value("${vnpay.tmncode}")
    private String vnp_TmnCode;

    @Value("${vnpay.hashsecret}")
    private String vnp_HashSecret;

    @Value("${vnpay.payurl}")
    private String vnp_PayUrl;

    @Value("${vnpay.returnurl}")
    private String vnp_ReturnUrl;

    public String createPaymentUrl(Long amount, String orderId) throws Exception {
        String vnp_Version = "2.1.0";
        String vnp_Command = "pay";
        String orderType = "other";
        String locale = "vn";
        String currCode = "VND";
        Calendar cld = Calendar.getInstance(TimeZone.getTimeZone("Etc/GMT+7"));
        String vnp_TxnRef = orderId;
        String vnp_IpAddr = "171.250.162.150";
        String vnp_CreateDate = new SimpleDateFormat("yyyyMMddHHmmss").format(cld.getTime());

        Map<String, String> vnp_Params = new HashMap<>();
        vnp_Params.put("vnp_Version", vnp_Version);
        vnp_Params.put("vnp_Command", vnp_Command);
        vnp_Params.put("vnp_TmnCode", vnp_TmnCode);
        vnp_Params.put("vnp_Amount", String.valueOf(amount * 100));  // VNPay expects amount in VND cents
        vnp_Params.put("vnp_CurrCode", currCode);
        vnp_Params.put("vnp_TxnRef", vnp_TxnRef);
        vnp_Params.put("vnp_OrderInfo", "Payment for order: " + orderId);
        vnp_Params.put("vnp_OrderType", orderType);
        vnp_Params.put("vnp_Locale", locale);
        vnp_Params.put("vnp_ReturnUrl", vnp_ReturnUrl);
        vnp_Params.put("vnp_IpAddr", vnp_IpAddr);
        vnp_Params.put("vnp_CreateDate", vnp_CreateDate);

        List<String> fieldNames = new ArrayList<>(vnp_Params.keySet());
        Collections.sort(fieldNames);
        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();
        for (String fieldName : fieldNames) {
            String fieldValue = vnp_Params.get(fieldName);
            if (!query.isEmpty()) {
                query.append("&");
                hashData.append("&");
            }
            query.append(URLEncoder.encode(fieldName, StandardCharsets.US_ASCII.toString()))
                    .append("=")
                    .append(URLEncoder.encode(fieldValue, StandardCharsets.US_ASCII.toString()));
            hashData.append(fieldName).append("=").append(fieldValue);
        }

        // Secure hash with buffer encoding
        String encodedHashData = bufferEncode(hashData.toString());
        String secureHash = hmacSHA512(vnp_HashSecret, encodedHashData);
        query.append("&vnp_SecureHash=").append(secureHash);

        return vnp_PayUrl + "?" + query.toString();
    }

    private String hmacSHA512(String key, String data) throws Exception {
        Mac hmacSHA512 = Mac.getInstance("HmacSHA512");
        SecretKeySpec secretKey = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
        hmacSHA512.init(secretKey);
        byte[] hash = hmacSHA512.doFinal(data.getBytes(StandardCharsets.UTF_8));
        StringBuilder result = new StringBuilder();
        for (byte b : hash) {
            result.append(String.format("%02x", b));
        }
        return result.toString();
    }

    // Buffer encode function
    private String bufferEncode(String input) {
        StringBuilder encoded = new StringBuilder();
        for (char c : input.toCharArray()) {
            encoded.append("%").append(String.format("%02X", (int) c));
        }
        return encoded.toString();
    }
}
