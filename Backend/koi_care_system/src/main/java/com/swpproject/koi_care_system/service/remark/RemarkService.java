package com.swpproject.koi_care_system.service.remark;

import com.swpproject.koi_care_system.dto.RemarkDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.RemarkMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.models.Remark;
import com.swpproject.koi_care_system.payload.request.RemarkCreateRequest;
import com.swpproject.koi_care_system.payload.request.RemarkUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.repository.RemarkRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class RemarkService implements IRemarkService {
    RemarkRepository remarkRepository;
    RemarkMapper remarkMapper;
    KoiFishRepository koiFishRepository;

    @Override
    public RemarkDto createRemark(RemarkCreateRequest remarkCreateRequest) {
        Remark remark = remarkMapper.mapToRemark(remarkCreateRequest);
        KoiFish koiFish = koiFishRepository.findById(remarkCreateRequest.getKoiFishId()).orElseThrow(() -> new AppException(ErrorCode.KOI_FISH_NOT_FOUND));
        remark.setKoiFish(koiFish);
        return remarkMapper.mapToRemarkDto(remarkRepository.save(remark));
    }

    @Override
    public RemarkDto updateRemark(Long id, RemarkUpdateRequest remarkUpdateRequest) {
        Remark remark = remarkRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.REMARK_NOT_FOUND));
        remarkMapper.updateRemark(remark, remarkUpdateRequest);
        return remarkMapper.mapToRemarkDto(remarkRepository.save(remark));
    }

    @Override
    public void deleteRemark(Long id) {
        Remark remark = remarkRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.REMARK_NOT_FOUND));
        remarkRepository.delete(remark);
    }

    @Override
    public RemarkDto getRemark(Long id) {
        Remark remark = remarkRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.REMARK_NOT_FOUND));
        return remarkMapper.mapToRemarkDto(remark);
    }

    @Override
    public List<RemarkDto> getRemarksByKoiFish(Long koiFishId) {
        List<Remark> remarks = remarkRepository.findAllByKoiFishId(koiFishId);
        return remarks.stream().map(remarkMapper::mapToRemarkDto).toList();
    }
}