package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.WaterParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WaterParametersRepository extends JpaRepository<WaterParameters, Long> {
}
