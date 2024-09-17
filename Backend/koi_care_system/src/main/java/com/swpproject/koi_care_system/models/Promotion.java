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
public class Promotion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private Double discountRate;
    private String description;
    private Date startDate;
    private Date endDate;
    private String status;

    @OneToOne
    @JoinColumn(name="product_id")
    private Product product;

}
