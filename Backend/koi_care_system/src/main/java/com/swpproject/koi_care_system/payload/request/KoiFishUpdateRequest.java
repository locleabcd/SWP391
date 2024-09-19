package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.KoiPond;
import lombok.Data;

import java.util.Date;

@Data
public class KoiFishUpdateRequest {
    private Long id;
    private String name;
    private int age;
    private String gender;
    private String variety;
    private Date pondDate;
    private String breeder;
    private Double price;
    private KoiPond koiPond;
    private String imageUrl;
    private String status;
}
