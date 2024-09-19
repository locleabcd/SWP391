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
}
