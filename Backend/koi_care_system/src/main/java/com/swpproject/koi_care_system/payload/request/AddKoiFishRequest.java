package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.KoiPond;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;

import java.time.LocalDate;

@Data
public class AddKoiFishRequest {
    private String name;
    private String physique;
    private int age;
    private Double length;
    private Double weight;
    private String gender;
    private String variety;
    private LocalDate pondDate;
    private String breeder;
    private Double price;
    private Long koiPondId;
    private MultipartFile file;

}