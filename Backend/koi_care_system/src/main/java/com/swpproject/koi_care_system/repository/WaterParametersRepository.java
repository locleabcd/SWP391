package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.WaterParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterParametersRepository extends JpaRepository<WaterParameters, Long> {
    
    List<WaterParameters> findByKoiPondId(Long koiPondId);
}