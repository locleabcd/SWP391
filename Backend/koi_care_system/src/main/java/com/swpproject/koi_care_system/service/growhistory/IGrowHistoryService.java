package com.swpproject.koi_care_system.service.growhistory;

import com.swpproject.koi_care_system.dto.GrowHistoryDto;
import com.swpproject.koi_care_system.payload.request.GrowCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowUpdateRequest;

import java.util.List;

public interface IGrowHistoryService {
    GrowHistoryDto createGrowHistory(GrowCreateRequest growCreateRequest);

    GrowHistoryDto updateGrowHistory(Long id, GrowUpdateRequest growUpdateRequest);

    void deleteGrowHistory(Long id);

    GrowHistoryDto getGrowHistory(Long id);

    List<GrowHistoryDto> getListGrowHistory(long koiFishId);
}
