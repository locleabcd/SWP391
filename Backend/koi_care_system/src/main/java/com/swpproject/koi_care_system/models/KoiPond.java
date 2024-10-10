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
    @Column(nullable = false, unique = true)
    private String name;
    private int drainCount;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private int volume;
    private String imageUrl;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "koiPond", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<WaterParameters> waterParametersList;

    @OneToMany(mappedBy = "koiPond",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Log> logList;

}