package com.swpproject.koi_care_system.payload.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class LogUpdateRequest {

    @NotBlank(message = "Title is required")
    String logTitle;
    LocalDateTime logDate;
    String category;
    String note;
    @NotNull
    long koiPondId;
}