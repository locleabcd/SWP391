package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.KoiPond;
import lombok.Data;

import java.util.Date;

@Data
public class AddKoiFishRequest {
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
    private KoiPond koiPond;
    private String imageUrl;
    public AddKoiFishRequest(String name, String physique, int age, Double length, Double weight,
                             String gender, String variety, Date pondDate, String breeder, Double price, KoiPond koiPond, String imageUrl) {
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
