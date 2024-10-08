package com.swpproject.koi_care_system.service.issue;

import com.swpproject.koi_care_system.dto.IssueTypeDto;
import com.swpproject.koi_care_system.enums.RangeParameter;
import com.swpproject.koi_care_system.mapper.IssueTypeMapper;
import com.swpproject.koi_care_system.models.IssueType;
import com.swpproject.koi_care_system.repository.IssueTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IssueTypeService implements IIssueTypeService {
    IssueTypeRepository issueTypeRepository;
    IssueTypeMapper issueTypeMapper;
    public void init() {
        for (RangeParameter parameter : RangeParameter.values()) {
            // Create HIGH IssueType if it doesn't exist
            if (issueTypeRepository.findByParameterTypeAndConditionType(parameter, "HIGH") == null) {
                IssueType highIssueType = new IssueType();
                highIssueType.setParameterType(parameter);
                highIssueType.setConditionType("HIGH");
                issueTypeRepository.save(highIssueType);
            }

            // Create LOW IssueType if it doesn't exist
            if (issueTypeRepository.findByParameterTypeAndConditionType(parameter, "LOW") == null) {
                IssueType lowIssueType = new IssueType();
                lowIssueType.setParameterType(parameter);
                lowIssueType.setConditionType("LOW");
                issueTypeRepository.save(lowIssueType);
            }
        }
    }

    @Override
    public List<IssueTypeDto> getAllIssueType() {
        return issueTypeRepository.findAll().stream().map(issueTypeMapper::maptodto).toList();
    }
}