package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class GrowthHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private LocalDate createDate;
    private String physique;
    private Double length;
    private Double weight;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name="koifish_id")
    private KoiFish koiFish;


}