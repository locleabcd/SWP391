package com.swpproject.koi_care_system.payload.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class KoiPondUpdateRequest {
    private Long id;
    private String name;
    private int drainCount;
    private int volume;
    private Double depth;
    private int skimmer;
    private Double pumpCapacity;
    private MultipartFile file;

}