package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Issue;
import com.swpproject.koi_care_system.models.WaterParameters;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    Issue findByWaterParametersAndName(WaterParameters waterParameters, String name);

    boolean existsByWaterParametersAndDescription(WaterParameters waterParameters, String description);

    List<Issue> findByWaterParametersId(Long waterParametersId);
}