package com.swpproject.koi_care_system.models;

import com.swpproject.koi_care_system.enums.ProfileStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDate;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    String name;
    String email;
    String phone;
    String address;
    String gender;
    String avatar;
    String bio;
    LocalDate dateOfBirth;
    LocalDate createdDate;
    @Enumerated(EnumType.STRING)
    ProfileStatus status;//NORMAL, PREMIUM
    String role;

    @OneToOne
    @JoinColumn(name = "user_id")
    User user;
}