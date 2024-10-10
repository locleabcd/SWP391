package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.KoiPond;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
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
    private String status;
    private MultipartFile file;
}