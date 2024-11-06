package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.PromotionStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    @Enumerated(EnumType.STRING)
    private PromotionStatus status;

    @ManyToMany(mappedBy = "promotions",cascade = CascadeType.ALL)
    private Set<Product> products = new HashSet<Product>();
}