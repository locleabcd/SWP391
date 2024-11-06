package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
public class OriginStateOfFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String physique;
    private LocalDate pondDate;
    private int age;
    private Double length;
    private Double weight;
    private String gender;
    private String variety;
    @OneToOne
    @JoinColumn(name="koiFish_id")
    private KoiFish koiFish;
}
