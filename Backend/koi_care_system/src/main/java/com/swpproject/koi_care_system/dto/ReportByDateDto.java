package com.swpproject.koi_care_system.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class ReportByDateDto {
    List<KoiFishDto> koiFishs;
    List<KoiPondDto> koiPonds;
    List<WaterParameterDto> waterParameters;

}
