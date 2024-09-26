package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.KoiPond;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class KoiFishUpdateRequest {
    private Long id;
    private String name;
    private int age;
    private String gender;
    private String variety;
    private LocalDate pondDate;
    private String breeder;
    private Double price;
    private Long koiPondId;
    private KoiPond koiPond;
    private String imageUrl;
    private String status;
    private MultipartFile file;
    public KoiFishUpdateRequest(String name, int age, String gender, String variety, LocalDate pondDate, String breeder, Double price, KoiPond koiPond, String imageUrl, String status) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.variety = variety;
        this.pondDate = pondDate;
        this.breeder = breeder;
        this.price = price;
        this.koiPond = koiPond;
        this.imageUrl = imageUrl;
        this.status = status;
    }
}
