package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.models.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueRepository extends JpaRepository<Issue, Long> {
    List<Issue> findByWaterParametersId(Long waterParametersId);
}