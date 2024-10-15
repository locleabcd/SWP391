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
        List<Issue> existingIssues = issueRepository.findByWaterParametersKoiPondId(waterParameters.getKoiPond().getId());
        if (!existingIssues.isEmpty()) {
            issueRepository.deleteAll(existingIssues);
        }
        for (RangeParameter parameter : RangeParameter.values()) {
            double value = getParameterValue(waterParameters, parameter);
            if (parameter.isLow(value) || parameter.isHigh(value)) {
                String conditionType = parameter.isLow(value) ? "LOW" : "HIGH";
                createIssue(conditionType, parameter, waterParameters);
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
            issue.setDescription(getDescription(parameter, conditionType));
            issueRepository.save(issue);
        }
    }

    public List<IssueDto> getIssue(Long waterParametersId) {
        return issueRepository.findByWaterParametersId(waterParametersId).stream().map(issueMapper::mapToIssueDto).toList();
    }

    private double getParameterValue(WaterParameters waterParameters, RangeParameter parameter) {
        return switch (parameter) {
            case NO2 -> waterParameters.getNitrite();
            case NO3 -> waterParameters.getNitrate();
            case PO4 -> waterParameters.getPhosphate();
            case NH4 -> waterParameters.getAmmonium();
            case GH -> waterParameters.getHardness();
            case O2 -> waterParameters.getOxygen();
            case TEMPERATURE -> waterParameters.getTemperature();
            case PH -> waterParameters.getPhValue();
            case KH -> waterParameters.getCarbonHardness();
            case CO2 -> waterParameters.getCarbonDioxide();
            case SALT -> waterParameters.getSalt();
            case CHLORINE -> waterParameters.getTotalChlorine();
            case OUTDOORTEMP -> waterParameters.getTemp();
            default -> throw new IllegalArgumentException("Unknown parameter: " + parameter);
        };
    }

    private String getDescription(RangeParameter parameter, String conditionType) {
        switch (parameter) {
            case NO2 -> {
                return conditionType.equals("HIGH") ? "High nitrite levels are toxic to Koi fish, causing stress, impaired oxygen transport in the blood, and possibly leading to death if not corrected." : "Low nitrite levels can indicate inadequate filtration or biological activity, leading to potential imbalances in water quality";
            }
            case NO3 -> {
                return conditionType.equals("HIGH") ? "High nitrate levels can promote algae blooms and stress fish, leading to poor health and increased disease susceptibility." : "Low nitrate levels can hinder plant growth and may signal a poorly established nitrogen cycle.";
            }
            case PO4 -> {
                return conditionType.equals("HIGH") ? "High phosphate levels can cause excessive algae growth, leading to oxygen depletion and poor water quality." : "Low phosphate levels can limit plant growth, impacting the ecosystem balance.";
            }
            case TEMPERATURE -> {
                return conditionType.equals("HIGH") ? "High temperatures can lead to decreased oxygen levels, increased stress, and heightened disease risk." : "Low temperatures can slow down the metabolism of Koi fish, making them lethargic and more susceptible to disease.";
            }
            case PH -> {
                return conditionType.equals("HIGH") ? "High pH levels can impair fish health and increase the toxicity of ammonia." : "Low pH levels can stress Koi fish and lead to harmful metal leaching from the pond materials.";
            }
            case NH4 -> {
                return conditionType.equals("HIGH") ? "High ammonium levels are highly toxic to Koi fish and can cause gill damage and stress, potentially leading to death." : "Low ammonium levels indicate effective biological filtration; however, very low levels can signal a lack of necessary biological activity.";
            }
            case GH -> {
                return conditionType.equals("HIGH") ? "High hardness levels can inhibit the absorption of essential nutrients and minerals for Koi fish health." : "Low hardness levels can stress Koi fish by affecting their ability to regulate their internal salt balance.";
            }
            case KH -> {
                return conditionType.equals("HIGH") ? "High KH levels can stabilize pH but may also limit the availability of essential nutrients." : "Low KH levels can lead to pH fluctuations, stressing Koi fish and affecting their health.";
            }
            case O2 -> {
                return conditionType.equals("HIGH") ? "High oxygen levels, while generally beneficial, can lead to gas bubble disease in extreme cases." : "Low oxygen levels can lead to suffocation, stress, and increased mortality rates in Koi fish.";
            }
            case CO2 -> {
                return conditionType.equals("HIGH") ? "High CO2 levels can lead to decreased oxygen availability, stressing Koi fish." : "Low CO2 levels can hinder plant growth, affecting the overall ecosystem balance.";
            }
            case SALT -> {
                return conditionType.equals("HIGH") ? "High salt levels can lead to osmotic stress in Koi fish, affecting their health and vitality." : "Low salt levels may fail to provide the necessary osmotic balance, potentially stressing Koi fish.";
            }
            case CHLORINE -> {
                return conditionType.equals("HIGH") ? "High chlorine levels are toxic to Koi fish, leading to gill damage and respiratory distress." : "Low chlorine levels are generally safe for Koi fish; however, extremely low levels may indicate inadequate disinfection.";
            }
            case OUTDOORTEMP -> {
                return conditionType.equals("HIGH") ? "High outdoor temperatures can lead to heat stress, reduced oxygen levels, and increased disease risk." : "Extremely low outdoor temperatures can cause Koi fish to enter a dormant state, leading to decreased activity and potential health risks.";
            }
            default -> {
                return "";
            }
        }
    }
}