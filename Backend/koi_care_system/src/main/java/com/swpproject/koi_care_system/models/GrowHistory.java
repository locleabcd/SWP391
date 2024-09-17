package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Date;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class GrowHistory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date createDate;
    private String physique;
    private Double length;
    private Double weight;

    @ManyToOne
    @JoinColumn(name="koifish_id")
    private KoiFish koiFish;


}
