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
    private int volume;
    private String imageUrl;
    // Add this method
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @OneToMany(mappedBy = "koiPond",cascade = CascadeType.ALL, orphanRemoval = true)
    List<WaterParameters> waterParametersList;

    @OneToMany(mappedBy = "koiPond",cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Log> logList;
    public KoiPond(Long id, String name, int drainCount, Double depth, int skimmer, Double pumpCapacity,int volume,User user, String imageUrl) {
        this.id = id;
        this.name = name;
        this.drainCount = drainCount;
        this.depth = depth;
        this.skimmer = skimmer;
        this.pumpCapacity = pumpCapacity;
        this.volume = volume;
        this.imageUrl = imageUrl;
        this.user = user;
    }
}