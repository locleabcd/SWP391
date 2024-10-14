package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.enums.Role;
import com.swpproject.koi_care_system.models.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserProfileRepository extends JpaRepository<UserProfile, Long> {
    Optional<UserProfile> findByUserId(Long userId);
    UserProfile findUserProfileByUserId(Long userId);

    List<UserProfile> findUserProfileByRole(String role);
}