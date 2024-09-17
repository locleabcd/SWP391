package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;
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

    private Date creatDateTime;

    private Double specValue;

    private String note;

    @OneToMany(mappedBy = "waterParametersHistory",cascade = CascadeType.ALL,orphanRemoval = false)
    List<Specification> specificationList;

    @ManyToOne
    @JoinColumn(name="koiPond_id")
    private KoiPond koiPond;
}
