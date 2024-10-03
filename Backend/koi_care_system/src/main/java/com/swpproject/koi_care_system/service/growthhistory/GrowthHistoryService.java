package com.swpproject.koi_care_system.service.growthhistory;

import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.enums.ErrorCode;
import com.swpproject.koi_care_system.exceptions.AppException;
import com.swpproject.koi_care_system.mapper.GrowthHistoryMapper;
import com.swpproject.koi_care_system.models.GrowthHistory;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;
import com.swpproject.koi_care_system.repository.GrowthHistoryRepository;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GrowthHistoryService implements IGrowthHistoryService {
    GrowthHistoryRepository growthHistoryRepository;
    GrowthHistoryMapper growthHistoryMapper;
    KoiFishRepository koiFishRepository;

    @Override
    public GrowthHistoryDto createGrowthHistory(GrowthCreateRequest growthCreateRequest) {
        KoiFish koiFish = koiFishRepository.findById(growthCreateRequest.getKoiFishId()).orElseThrow(() -> new AppException(ErrorCode.KOI_FISH_NOT_FOUND));
        GrowthHistory growthHistory = growthHistoryMapper.mapToGrowthHistory(growthCreateRequest);
        growthHistory.setKoiFish(koiFish);//relation between growHistory and koiFish
        if (growthCreateRequest.getImageUrl().isEmpty()) growthHistory.setImageUrl("defaultGrowth.png");
        //If new growthHistory is the latest, update KoiFish
        GrowthHistory savedGrowthHistory = growthHistoryRepository.save(growthHistory);
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        if (savedGrowthHistory.getId() == latestId) {
            //Update KoiFish
            updateKoiFish(savedGrowthHistory);
            koiFishRepository.save(koiFish);
        }
        return growthHistoryMapper.mapToGrowthHistoryDto(savedGrowthHistory);
    }

    @Override
    public GrowthHistoryDto updateGrowthHistory(Long id, GrowthUpdateRequest growthUpdateRequest) {
        GrowthHistory growthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        growthHistoryMapper.updateGrowthHistory(growthHistory, growthUpdateRequest);
        KoiFish koiFish = growthHistory.getKoiFish();
        if (growthUpdateRequest.getImageUrl().isEmpty()) growthHistory.setImageUrl("defaultGrowth.png");
        GrowthHistory updatedGrowthHistory = growthHistoryRepository.save(growthHistory);
        //Update latest KoiFish
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowthHistory growthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        updateKoiFish(growthHistoryLatest);
        koiFishRepository.save(koiFish);

        return growthHistoryMapper.mapToGrowthHistoryDto(updatedGrowthHistory);
    }

    @Override
    public void deleteGrowthHistory(Long id) {
        GrowthHistory growthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        KoiFish koiFish = growthHistory.getKoiFish();
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFish.getId());
        if (growHistories.size() == 1) {
            throw new IllegalArgumentException("GrowHistory must be at least 1");
        }

        growthHistoryRepository.delete(growthHistory);

        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowthHistory growthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));

        updateKoiFish(growthHistoryLatest);
        growthHistoryRepository.save(growthHistoryLatest);
    }

    @Override
    public GrowthHistoryDto getGrowthHistory(Long id) {
        return growthHistoryRepository.findById(id).map(growthHistoryMapper::mapToGrowthHistoryDto).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
    }

    @Override
    public List<GrowthHistoryDto> getListGrowthHistory(long koiFishId) {
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFishId);
        return growHistories.stream().map(growthHistoryMapper::mapToGrowthHistoryDto).toList();
    }

    private void updateKoiFish(GrowthHistory growthHistory) {
        KoiFish koiFish = growthHistory.getKoiFish();
        if (!"defaultGrowth.png".equals(growthHistory.getImageUrl())) {
            koiFish.setImageUrl(growthHistory.getImageUrl());
        }
        koiFish.setPhysique(growthHistory.getPhysique());
        koiFish.setLength(growthHistory.getLength());
        koiFish.setWeight(growthHistory.getWeight());
    }
}
