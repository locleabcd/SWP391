package com.swpproject.koi_care_system.repository;

import com.swpproject.koi_care_system.enums.RangeParameter;
import com.swpproject.koi_care_system.models.IssueType;
import org.jetbrains.annotations.NotNull;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IssueTypeRepository extends JpaRepository<IssueType, Long> {
    IssueType findByParameterTypeAndConditionType(RangeParameter parameter, String high);

    @NotNull List<IssueType> findAll();

}