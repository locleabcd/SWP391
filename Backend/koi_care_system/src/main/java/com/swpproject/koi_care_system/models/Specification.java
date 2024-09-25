package com.swpproject.koi_care_system.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Specification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String abbreviation;
    private String description;
    private Double minValue;
    private Double maxValue;

    @ManyToOne
    @JoinColumn(name="waterParametersHistory_id")
    private WaterParametersHistory waterParametersHistory;

    @OneToOne
    @JoinColumn(name="issue_id")
    private Issue issue;
}
