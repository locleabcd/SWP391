package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;
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
    private Date pondDate;
    private String breeder;
    private Double price;

    @OneToOne
    @JoinColumn(name="koiFish_id")
    private Image imageList;

    @ManyToOne
    @JoinColumn(name="koiPond_id")
    private KoiPond koiPond;

    @OneToMany(mappedBy = "koiFish",cascade = CascadeType.ALL,orphanRemoval = true)
    List<GrowHistory> growHistoryList;

    @OneToMany(mappedBy = "koiFish",cascade = CascadeType.ALL,orphanRemoval = true)
    List<Remark> remarkList;
}
