package com.swpproject.koi_care_system.payload.request;

import com.swpproject.koi_care_system.models.User;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.multipart.MultipartFile;
import reactor.util.annotation.Nullable;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class AddKoiPondRequest {
     String name;
     int drainCount;
     int volume;
     Double depth;
     int skimmer;
     Double pumpCapacity;
     User user;
     String imageUrl;
     MultipartFile file;
}
