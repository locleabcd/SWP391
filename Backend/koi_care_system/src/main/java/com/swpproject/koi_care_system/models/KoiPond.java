package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class KoiPond {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private int drainCount;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    @OneToOne
    @JoinColumn(name="product_id")
    private Image imageList;

    @OneToMany(mappedBy = "koiPond",cascade = CascadeType.ALL,orphanRemoval = false)
    List<KoiFish> koiFishList;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "koiPond",cascade = CascadeType.ALL,orphanRemoval = true)
    List<WaterParametersHistory> waterParametersHistoryList;
}
