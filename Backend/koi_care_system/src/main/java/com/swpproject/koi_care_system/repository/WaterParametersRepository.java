package com.swpproject.koi_care_system.repository;

import aj.org.objectweb.asm.commons.Remapper;
import com.swpproject.koi_care_system.models.WaterParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WaterParametersRepository extends JpaRepository<WaterParameters, Long> {
    
    List<WaterParameters> findByKoiPondId(Long koiPondId);

    @Query("SELECT w FROM WaterParameters w WHERE w.koiPond.id = :koiPondId ORDER BY w.id DESC LIMIT 1")
    WaterParameters findTopByKoiPondId(Long koiPondId);
}