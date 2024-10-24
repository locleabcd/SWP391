package com.swpproject.koi_care_system.service.report;

import com.swpproject.koi_care_system.dto.FishGrowthReportDto;
import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.models.OriginStateOfFish;
import com.swpproject.koi_care_system.repository.OriginStateOfFishRepository;
import com.swpproject.koi_care_system.service.growthhistory.IGrowthHistoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FishGrowthReportService {

    private final List<Double> growthRates = Arrays.asList(0.076, 0.06, 0.0334, 0.022, 0.015, 0.01, 0.0097, 0.007, 0.0017);
    private final IGrowthHistoryService growthHistoryService;
    private final OriginStateOfFishRepository originStateOfFishRepository;

    public List<FishGrowthReportDto> getFishGrowthReport(Long koiFishId) {
        List<FishGrowthReportDto> reportDtos = new ArrayList<>();
        List<GrowthHistoryDto> growthHistoryDtos = growthHistoryService.getListGrowthHistory(koiFishId);

        if (!growthHistoryDtos.isEmpty()) {
            OriginStateOfFish originStateOfFish = originStateOfFishRepository.findOriginStateOfFishByKoiFishId(koiFishId);
            reportDtos.add(createInitialReportDto(originStateOfFish));

            for (int i = 0; i < growthHistoryDtos.size(); i++) {
                GrowthHistoryDto growthHistory = growthHistoryDtos.get(i);
                double lengthTmp = calculateLength(originStateOfFish, reportDtos.get(i), growthHistory);
                double weightTmp = calculateWeight(growthHistory.getPhysique(), lengthTmp);

                reportDtos.add(createGrowthReportDto(growthHistory, lengthTmp, weightTmp));
            }
        }

        return reportDtos;
    }

    private FishGrowthReportDto createInitialReportDto(OriginStateOfFish originStateOfFish) {
        return FishGrowthReportDto.builder()
                .id(originStateOfFish.getId())
                .createDate(originStateOfFish.getPondDate().atTime(0, 0, 0))
                .length(originStateOfFish.getLength())
                .physique(originStateOfFish.getPhysique())
                .weight(originStateOfFish.getWeight())
                .build();
    }

    private double calculateLength(OriginStateOfFish originState, FishGrowthReportDto previousReport, GrowthHistoryDto growthHistory) {
        LocalDate pondDate = originState.getPondDate();
        int age = originState.getAge();
        LocalDate reportDate = previousReport.getCreateDate().toLocalDate();
        LocalDate growthDate = growthHistory.getCreateDate().toLocalDate();

        if (Period.between(pondDate, growthDate).getYears() - Period.between(pondDate, reportDate).getYears() > 0) {
            LocalDate keyPoint = pondDate.plusYears(Period.between(pondDate, growthDate).getYears());
            double lengthTmp = previousReport.getLength() + getGrowthForPeriod(age, reportDate, keyPoint.minusDays(1));
            age = keyPoint.getYear();
            return lengthTmp + getGrowthForPeriod(age, keyPoint, growthDate);
        } else {
            age += Period.between(pondDate, growthDate).getYears();
            return previousReport.getLength() + getGrowthForPeriod(age, reportDate, growthDate);
        }
    }

    private double getGrowthForPeriod(int age, LocalDate start, LocalDate end) {
        int ageIndex = age < 9 ? age : 8;
        double growthRate = growthRates.get(ageIndex);
        return growthRate * ChronoUnit.DAYS.between(start, end);
    }

    private double calculateWeight(String physique, double length) {
        double weightFactor = switch (physique) {
            case "Slim" -> 1.5;
            case "Normal" -> 1.7;
            case "Corpulent" -> 2.0;
            default -> 0.0;
        };
        return Math.round((weightFactor * Math.pow(length, 3)) / 100.0 * 100.0) / 100.0;
    }

    private FishGrowthReportDto createGrowthReportDto(GrowthHistoryDto growthHistory, double length, double weight) {
        return FishGrowthReportDto.builder()
                .id(growthHistory.getId())
                .createDate(growthHistory.getCreateDate())
                .physique(growthHistory.getPhysique())
                .length(Math.round(length * 100.0) / 100.0)
                .weight(Math.round(weight * 100.0) / 100.0)
                .build();
    }
}
