package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class PaymentDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String status;

    private String externalTransactionCode;

    @OneToOne
    @JoinColumn(name="paymentMethod_id")
    private PaymentMethod paymentMethod;
    @OneToOne
    @JoinColumn(name="payment_id")
    private Payment payment;


}
