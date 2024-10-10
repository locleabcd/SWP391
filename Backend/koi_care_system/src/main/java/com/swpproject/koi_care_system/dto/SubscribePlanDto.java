package com.swpproject.koi_care_system.dto;

import com.swpproject.koi_care_system.enums.ProfileStatus;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SubscribePlanDto {
    Long id;
    LocalDate startDate;
    LocalDate expiredDate;
    ProfileStatus subscribe;
    UserProfileDto userProfileDto;

}
