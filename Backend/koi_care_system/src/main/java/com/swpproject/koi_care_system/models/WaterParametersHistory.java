package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class WaterParametersHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDateTime createDateTime;

    private Double specValue;

    private String note;

    @OneToMany(mappedBy = "waterParametersHistory",cascade = CascadeType.ALL,orphanRemoval = false)
    List<Specification> specificationList;
    //TODO

    @ManyToOne
    @JoinColumn(name="koiPond_id")
    private KoiPond koiPond;
}
