package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date createDate;
    private Double amount;
    private String status;

    @OneToOne
    @JoinColumn(name="order_id")
    private Order order;



}
