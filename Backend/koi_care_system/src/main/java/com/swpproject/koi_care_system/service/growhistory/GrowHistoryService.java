package com.swpproject.koi_care_system.service.growhistory;

import com.swpproject.koi_care_system.dto.GrowHistoryDto;
import com.swpproject.koi_care_system.mapper.GrowHistoryMapper;
import com.swpproject.koi_care_system.models.GrowHistory;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.GrowCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowUpdateRequest;
import com.swpproject.koi_care_system.repository.GrowHistoryRepository;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GrowHistoryService implements IGrowHistoryService {
    GrowHistoryRepository growHistoryRepository;
    GrowHistoryMapper growHistoryMapper;
    KoiFishRepository koiFishRepository;

    @Override
    public GrowHistoryDto createGrowHistory(GrowCreateRequest growCreateRequest) {
        KoiFish koiFish = koiFishRepository.findById(growCreateRequest.getKoiFishId()).orElseThrow(() -> new IllegalArgumentException("KoiFish not found"));
        //TODO : check if image create then update koiFish image
        GrowHistory growHistory = growHistoryMapper.mapToGrowHistory(growCreateRequest);
        if (growCreateRequest.getImageUrl().isEmpty()) growHistory.setImageUrl("default.png");
        else koiFish.setImageUrl(growCreateRequest.getImageUrl());
        growHistory.setKoiFish(koiFish);//relation between growHistory and koiFish
        //Update KoiFish
        updateKoiFish(growHistory);
        return growHistoryMapper.mapToGrowHistoryDto(growHistoryRepository.save(growHistory));
    }

    @Override
    public GrowHistoryDto updateGrowHistory(Long id, GrowUpdateRequest growUpdateRequest) {
        GrowHistory growHistory = growHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
        growHistoryMapper.updateGrowHistory(growHistory, growUpdateRequest);
        KoiFish koiFish = growHistory.getKoiFish();
        //TODO: check if image update then update koiFish image
        if (growUpdateRequest.getImageUrl().isEmpty()) growHistory.setImageUrl("default.png");
        //Update latest KoiFish
        long latestId = growHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        if (id.equals(latestId)) {
            updateKoiFish(growHistory);
        }
        return growHistoryMapper.mapToGrowHistoryDto(growHistoryRepository.save(growHistory));
    }

    @Override
    public void deleteGrowHistory(Long id) {
        //TODO: delete then update second koiFish
        GrowHistory growHistory = growHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
        KoiFish koiFish = growHistory.getKoiFish();
        List<GrowHistory> growHistories = growHistoryRepository.findAllByKoiFishId(koiFish.getId());
        if (growHistories.size() == 1) {
            throw new IllegalArgumentException("GrowHistory must be at least 1");
        }

        growHistoryRepository.delete(growHistory);

        long latestId = growHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowHistory growHistoryLatest = growHistoryRepository.findById(latestId).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));

        updateKoiFish(growHistoryLatest);
        growHistoryRepository.save(growHistoryLatest);
    }

    @Override
    public GrowHistoryDto getGrowHistory(Long id) {
        return growHistoryRepository.findById(id).map(growHistoryMapper::mapToGrowHistoryDto).orElseThrow(() -> new IllegalArgumentException("GrowHistory not found"));
    }

    @Override
    public List<GrowHistoryDto> getListGrowHistory(long koiFishId) {
        List<GrowHistory> growHistories = growHistoryRepository.findAllByKoiFishId(koiFishId);
        return growHistories.stream().map(growHistoryMapper::mapToGrowHistoryDto).toList();
    }

    private void updateKoiFish(GrowHistory growHistory) {
        KoiFish koiFish = growHistory.getKoiFish();
        koiFish.setImageUrl(growHistory.getImageUrl());
        koiFish.setPhysique(growHistory.getPhysique());
        koiFish.setLength(growHistory.getLength());
        koiFish.setWeight(growHistory.getWeight());
    }
}
