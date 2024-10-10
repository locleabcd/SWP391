package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ProfileStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@FieldDefaults(level = AccessLevel.PRIVATE)

public class SubscribePlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;
    LocalDate startDate;
    LocalDate expiredDate;

    @Enumerated(EnumType.STRING)
    ProfileStatus subscribe;

    @OneToOne
    @JoinColumn(name="userProfile_id")
    UserProfile userProfile;
}
