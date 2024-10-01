package com.swpproject.koi_care_system.service.growthhistory;

import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
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
        KoiFish koiFish = koiFishRepository.findById(growthCreateRequest.getKoiFishId()).orElseThrow(() -> new IllegalArgumentException("KoiFish not found"));
        //TODO : check if image create then update koiFish image
        GrowthHistory growthHistory = growthHistoryMapper.mapToGrowthHistory(growthCreateRequest);
        if (growthCreateRequest.getImageUrl().isEmpty()) growthHistory.setImageUrl("default.png");
        else koiFish.setImageUrl(growthCreateRequest.getImageUrl());
        growthHistory.setKoiFish(koiFish);//relation between growHistory and koiFish
        //Update KoiFish
        updateKoiFish(growthHistory);
        return growthHistoryMapper.mapToGrowthHistoryDto(growthHistoryRepository.save(growthHistory));
    }

    @Override
    public GrowthHistoryDto updateGrowthHistory(Long id, GrowthUpdateRequest growthUpdateRequest) {
        GrowthHistory growthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
        growthHistoryMapper.updateGrowthHistory(growthHistory, growthUpdateRequest);
        KoiFish koiFish = growthHistory.getKoiFish();
        //TODO: check if image update then update koiFish image
        if (growthUpdateRequest.getImageUrl().isEmpty()) growthHistory.setImageUrl("default.png");
        //Update latest KoiFish
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        if (id.equals(latestId)) {
            updateKoiFish(growthHistory);
        }
        return growthHistoryMapper.mapToGrowthHistoryDto(growthHistoryRepository.save(growthHistory));
    }

    @Override
    public void deleteGrowthHistory(Long id) {
        //TODO: delete then update second koiFish
        GrowthHistory growthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
        KoiFish koiFish = growthHistory.getKoiFish();
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFish.getId());
        if (growHistories.size() == 1) {
            throw new IllegalArgumentException("GrowHistory must be at least 1");
        }

        growthHistoryRepository.delete(growthHistory);

        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowthHistory growthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));

        updateKoiFish(growthHistoryLatest);
        growthHistoryRepository.save(growthHistoryLatest);
    }

    @Override
    public GrowthHistoryDto getGrowthHistory(Long id) {
        return growthHistoryRepository.findById(id).map(growthHistoryMapper::mapToGrowthHistoryDto).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
    }

    @Override
    public List<GrowthHistoryDto> getListGrowthHistory(long koiFishId) {
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFishId);
        return growHistories.stream().map(growthHistoryMapper::mapToGrowthHistoryDto).toList();
    }

    private void updateKoiFish(GrowthHistory growthHistory) {
        KoiFish koiFish = growthHistory.getKoiFish();
        koiFish.setImageUrl(growthHistory.getImageUrl());
        koiFish.setPhysique(growthHistory.getPhysique());
        koiFish.setLength(growthHistory.getLength());
        koiFish.setWeight(growthHistory.getWeight());
    }
}
