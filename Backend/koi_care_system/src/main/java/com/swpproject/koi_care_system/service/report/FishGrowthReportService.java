package com.swpproject.koi_care_system.service.report;

import com.swpproject.koi_care_system.dto.FishGrowthReportDto;
import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.service.growthhistory.IGrowthHistoryService;
import com.swpproject.koi_care_system.service.koifish.IKoiFishService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FishGrowthReportService {
    private final List<Double> growthRate = Arrays.asList(0.076, 0.06, 0.0334, 0.022, 0.015, 0.01, 0.0097, 0.007,0.0017);

    private final IGrowthHistoryService growthHistoryService;
    private final IKoiFishService koiFishService;

    public List<FishGrowthReportDto> getFishGrowthReport(Long koiFishId) {
        List<FishGrowthReportDto> reportDtos = new ArrayList<>();
        List<GrowthHistoryDto> growthHistoryDtos = growthHistoryService.getListGrowthHistory(koiFishId);
        if (!growthHistoryDtos.isEmpty()) {
            KoiFishDto koiFishDto = koiFishService.getKoiFishByName(growthHistoryDtos.get(0).getKoiFishName());
            FishGrowthReportDto standard = FishGrowthReportDto.builder()
                    .id(growthHistoryDtos.get(0).getId())
                    .createDate(growthHistoryDtos.get(0).getCreateDate())
                    .length(growthHistoryDtos.get(0).getLength())
                    .physique(growthHistoryDtos.get(0).getPhysique())
                    .weight(growthHistoryDtos.get(0).getWeight())
                    .build();
            reportDtos.add(standard);
            for (int i = 1; i < growthHistoryDtos.size(); i++) {
                double lengthTmp = growthHistoryDtos.get(i).getLength()
                        + growthRate.get((koiFishDto.getAge()<9)?koiFishDto.getAge():8)
                        * (ChronoUnit.DAYS.between(growthHistoryDtos.get(i - 1).getCreateDate(), growthHistoryDtos.get(i).getCreateDate()));
                double weightTmp = 0.0;
                switch (growthHistoryDtos.get(i).getPhysique()) {
                    case "Slim" -> weightTmp = (1.5 * Math.pow(lengthTmp, 3)) / 100;
                    case "Normal" -> weightTmp = (1.7 * Math.pow(lengthTmp, 3)) / 100;
                    case "Corpulent" -> weightTmp = (2 * Math.pow(lengthTmp, 3)) / 100;
                }
                lengthTmp = Math.round(lengthTmp*100.0)/100.0;
                weightTmp = Math.round(weightTmp*100.0)/100.0;
                reportDtos.add(FishGrowthReportDto.builder()
                        .id(growthHistoryDtos.get(i).getId())
                        .createDate(growthHistoryDtos.get(i).getCreateDate())
                        .physique(growthHistoryDtos.get(i).getPhysique())
                        .length(lengthTmp)
                        .weight(weightTmp)
                        .build());
            }
        }
        return reportDtos;
    }

}
