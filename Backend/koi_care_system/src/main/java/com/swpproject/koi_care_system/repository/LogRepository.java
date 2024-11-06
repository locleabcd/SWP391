package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.enums.LogCategory;
import com.swpproject.koi_care_system.models.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Integer> {
    List<Log> findAllByKoiPondId(long pondId);

    List<Log> findAllByCategory(LogCategory category);
}