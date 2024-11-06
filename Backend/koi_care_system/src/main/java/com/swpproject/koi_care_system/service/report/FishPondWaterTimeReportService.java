package com.swpproject.koi_care_system.service.report;


import com.swpproject.koi_care_system.dto.ReportByDateDto;
import com.swpproject.koi_care_system.service.koifish.IKoiFishService;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import com.swpproject.koi_care_system.service.waterparameter.IWaterParameters;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class FishPondWaterTimeReportService {
    private final IKoiPondService koiPondService;
    private final IKoiFishService koiFishService;
    private final IWaterParameters waterParameters;

    public ReportByDateDto getFishPondWaterTimeReport(Long userId, LocalDate date){
        return ReportByDateDto.builder()
                .koiFishs(koiFishService.getKoiFishByUserIdWithCurrentDate(userId,date))
                .koiPonds(koiPondService.getKoiPondByUserIdWithCurrentDate(userId,date))
                .waterParameters(waterParameters.getAllWaterParametersByUserIdAndCurrentDate(userId,date))
                .build();
    }

}
