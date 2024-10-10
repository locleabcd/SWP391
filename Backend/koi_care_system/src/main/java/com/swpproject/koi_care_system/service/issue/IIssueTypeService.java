package com.swpproject.koi_care_system.service.issue;

import com.swpproject.koi_care_system.dto.IssueTypeDto;
import com.swpproject.koi_care_system.models.IssueType;

import java.util.List;

public interface IIssueTypeService {
    List<IssueTypeDto> getAllIssueType();
}