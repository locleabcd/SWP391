package com.swpproject.koi_care_system.service.waterparameter;

import com.swpproject.koi_care_system.dto.WaterParameterDto;
import com.swpproject.koi_care_system.payload.request.ParametersCreateRequest;
import com.swpproject.koi_care_system.payload.request.ParametersUpdateRequest;

import java.util.List;

public interface IWaterParameters {
    WaterParameterDto createWaterParameters(ParametersCreateRequest parametersCreateRequest);

    WaterParameterDto updateWaterParameters(long id, ParametersUpdateRequest request);

    void deleteWaterParameters(long id);

    List<WaterParameterDto> getAllWaterParameters(int pageNumber, int pageSize, String sortBy, String sortDir);

    WaterParameterDto getWaterParametersById(long id);
    List<WaterParameterDto> getAllWaterParametersByKoiPondId(Long koiPondId);

    List<WaterParameterDto> getAllWaterParametersByUserId(Long userId);
    WaterParameterDto getLatestWaterParametersByKoiPondId(Long koiPondId);
}