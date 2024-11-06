package com.swpproject.koi_care_system.service.payment;

import com.swpproject.koi_care_system.dto.PaymentDto;
import com.swpproject.koi_care_system.payload.request.PaymentStoreRequest;

import java.util.List;

public interface IPaymentService {
    PaymentDto storePayment(PaymentStoreRequest request);

    List<PaymentDto> getAllPayment();

    List<PaymentDto> getAllPaymentByUserId(Long userId);


}
