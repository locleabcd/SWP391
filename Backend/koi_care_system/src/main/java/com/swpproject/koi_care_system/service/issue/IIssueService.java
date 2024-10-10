package com.swpproject.koi_care_system.service.issue;

import com.swpproject.koi_care_system.dto.IssueDto;
import com.swpproject.koi_care_system.models.WaterParameters;

import java.util.List;

public interface IIssueService {
    void detectIssues(WaterParameters waterParameters);

    List<IssueDto> getIssue(Long waterParametersId);
}