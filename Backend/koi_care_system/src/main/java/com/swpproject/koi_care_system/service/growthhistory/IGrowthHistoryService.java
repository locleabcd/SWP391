package com.swpproject.koi_care_system.service.growthhistory;

import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;

import java.io.IOException;
import java.util.List;

public interface IGrowthHistoryService {
    GrowthHistoryDto createGrowthHistory(GrowthCreateRequest growthCreateRequest) throws IOException;

    GrowthHistoryDto updateGrowthHistory(Long id, GrowthUpdateRequest growthUpdateRequest);

    void deleteGrowthHistory(Long id);

    GrowthHistoryDto getGrowthHistory(Long id);

    List<GrowthHistoryDto> getListGrowthHistory(long koiFishId);
}