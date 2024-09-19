package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.KoiFish;
import org.springframework.data.jpa.repository.JpaRepository;

import javax.swing.text.html.Option;
import java.util.List;
import java.util.Optional;

public interface KoiFishRepository extends JpaRepository<KoiFish,Long> {

    List<KoiFish> getKoiFishById(Long fishId);

    Optional<List<KoiFish>> findByKoiPondId(Long koiPondId);

    boolean existsByName(String name);
}
