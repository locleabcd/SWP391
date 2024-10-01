package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class KoiFish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String physique;
    private int age;
    private Double length;
    private Double weight;
    private String gender;
    private String variety;
    private LocalDate pondDate;
    private String breeder;
    private Double price;
    private String status;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name="koiPond_id")
    private KoiPond koiPond;

    @OneToMany(mappedBy = "koiFish",cascade = CascadeType.ALL,orphanRemoval = true)
    List<GrowthHistory> growthHistoryList;

    @OneToMany(mappedBy = "koiFish",cascade = CascadeType.ALL,orphanRemoval = true)
    List<Remark> remarkList;

    public KoiFish(Long id,String name, String physique, int age, Double length, Double weight, String gender, String variety, LocalDate pondDate, String breeder, Double price, KoiPond koiPond, String imageUrl) {
        this.id = id;
        this.name = name;
        this.physique = physique;
        this.age = age;
        this.length = length;
        this.weight = weight;
        this.gender = gender;
        this.variety = variety;
        this.pondDate = pondDate;
        this.breeder = breeder;
        this.price = price;
        this.koiPond = koiPond;
        this.imageUrl = imageUrl;
    }
}