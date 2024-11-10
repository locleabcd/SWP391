package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.User;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Data
public class AddKoiPondRequest {
    private String name;
    private LocalDate createDate;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private User user;
    private MultipartFile file;
}