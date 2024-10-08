package com.swpproject.koi_care_system.service.issue;

import com.swpproject.koi_care_system.dto.IssueDto;
import com.swpproject.koi_care_system.enums.RangeParameter;
import com.swpproject.koi_care_system.mapper.IssueMapper;
import com.swpproject.koi_care_system.models.Issue;
import com.swpproject.koi_care_system.models.IssueType;
import com.swpproject.koi_care_system.models.WaterParameters;
import com.swpproject.koi_care_system.repository.IssueRepository;
import com.swpproject.koi_care_system.repository.IssueTypeRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class IssueService implements IIssueService {
    IssueRepository issueRepository;
    IssueTypeRepository issueTypeRepository;
    IssueMapper issueMapper;

    public void detectIssues(WaterParameters waterParameters) {
        for (RangeParameter parameter : RangeParameter.values()) {
            double value = getParameterValue(waterParameters, parameter);

            if (parameter.isLow(value)) {
                createIssue("LOW", parameter, waterParameters);
            } else if (parameter.isHigh(value)) {
                createIssue("HIGH", parameter, waterParameters);
            } else {
                Issue issue = issueRepository.findByWaterParametersAndName(waterParameters, parameter.name());
                if (issue != null) {
                    issueRepository.delete(issue);
                }
            }
        }
    }

    private void createIssue(String conditionType, RangeParameter parameter, WaterParameters waterParameters) {
        IssueType issueType = issueTypeRepository.findByParameterTypeAndConditionType(parameter, conditionType);
        boolean issueExist = issueRepository.existsByWaterParametersAndDescription(waterParameters, conditionType + " " + parameter.name());

        if (!issueExist) {
            Issue issue = new Issue();
            issue.setName(parameter.getName());
            issue.setWaterParameters(waterParameters);
            issue.setIssueType(issueType);
            issue.setDescription(conditionType + " " + parameter.name());
            issueRepository.save(issue);
        }
    }

    public List<IssueDto> getIssue(Long waterParametersId) {
        return issueRepository.findByWaterParametersId(waterParametersId).stream().map(issueMapper::mapToIssueDto).toList();
    }


    private double getParameterValue(WaterParameters waterParameters, RangeParameter parameter) {
        switch (parameter) {
            case NO2:
                return waterParameters.getNitrite();
            case NO3:
                return waterParameters.getNitrate();
            case PO4:
                return waterParameters.getPhosphate();
            case NH4:
                return waterParameters.getAmmonium();
            case GH:
                return waterParameters.getHardness();
            case O2:
                return waterParameters.getOxygen();
            case TEMPERATURE:
                return waterParameters.getTemperature();
            case PH:
                return waterParameters.getPhValue();
            case KH:
                return waterParameters.getCarbonHardness();
            case CO2:
                return waterParameters.getCarbonDioxide();
            case SALT:
                return waterParameters.getSalt();
            case CHLORINE:
                return waterParameters.getTotalChlorine();
            case OUTDOORTEMP:
                return waterParameters.getTemp();
            default:
                throw new IllegalArgumentException("Unknown parameter: " + parameter);
        }
    }
}