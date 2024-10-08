package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.enums.RangeParameter;
import com.swpproject.koi_care_system.models.IssueType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IssueTypeRepository extends JpaRepository<com.swpproject.koi_care_system.models.IssueType, Long> {
    IssueType findByParameterTypeAndConditionType(RangeParameter parameter, String high);
}