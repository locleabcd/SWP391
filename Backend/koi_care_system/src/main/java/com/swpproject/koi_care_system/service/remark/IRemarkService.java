package com.swpproject.koi_care_system.service.remark;

import com.swpproject.koi_care_system.dto.RemarkDto;
import com.swpproject.koi_care_system.payload.request.RemarkCreateRequest;
import com.swpproject.koi_care_system.payload.request.RemarkUpdateRequest;

import java.util.List;

public interface IRemarkService {
    RemarkDto createRemark(RemarkCreateRequest remarkCreateRequest);

    RemarkDto updateRemark(Long id, RemarkUpdateRequest remarkUpdateRequest);

    void deleteRemark(Long id);

    RemarkDto getRemark(Long id);

    List<RemarkDto> getRemarksByKoiFish(Long koiFishId);
}