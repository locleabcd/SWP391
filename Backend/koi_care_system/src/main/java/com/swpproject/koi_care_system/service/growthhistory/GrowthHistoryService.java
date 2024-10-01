package com.swpproject.koi_care_system.service.growthhistory;

import com.swpproject.koi_care_system.dto.GrowthHistoryDto;
import com.swpproject.koi_care_system.mapper.GrowthHistoryMapper;
import com.swpproject.koi_care_system.models.GrowthHistory;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.GrowthCreateRequest;
import com.swpproject.koi_care_system.payload.request.GrowthUpdateRequest;
import com.swpproject.koi_care_system.repository.GrowthHistoryRepository;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class GrowthHistoryService implements IGrowthHistoryService {
    GrowthHistoryRepository growthHistoryRepository;
    GrowthHistoryMapper growthHistoryMapper;
    KoiFishRepository koiFishRepository;
    ImageStorage imageStorage;
    @Override
    public GrowthHistoryDto createGrowthHistory(GrowthCreateRequest growthCreateRequest) throws IOException {
        KoiFish koiFish = koiFishRepository.findById(growthCreateRequest.getKoiFishId()).orElseThrow(() -> new IllegalArgumentException("KoiFish not found"));
        //TODO : check if image create then update koiFish image
        if(growthCreateRequest.getFile()!=null){
            growthCreateRequest.setImageUrl(!growthCreateRequest.getFile().isEmpty()? imageStorage.uploadImage(growthCreateRequest.getFile()):"");
        }
        GrowthHistory GrowthHistory = growthHistoryMapper.mapToGrowthHistory(growthCreateRequest);
        GrowthHistory.setKoiFish(koiFish);//relation between GrowthHistory and koiFish
        //Update KoiFish
        updateKoiFish(GrowthHistory);
        return growthHistoryMapper.mapToGrowthHistoryDto(growthHistoryRepository.save(GrowthHistory));
    }

    @Override
    public GrowthHistoryDto updateGrowthHistory(Long id, GrowthUpdateRequest growthUpdateRequest) {
        GrowthHistory GrowthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowthHistory not found"));
        growthHistoryMapper.updateGrowthHistory(GrowthHistory, growthUpdateRequest);
        KoiFish koiFish = GrowthHistory.getKoiFish();
        //TODO: check if image update then update koiFish image
        if (growthUpdateRequest.getFile()!=null){
            try{
                GrowthHistory.setImageUrl(!growthUpdateRequest.getFile().isEmpty()? imageStorage.uploadImage(growthUpdateRequest.getFile()): GrowthHistory.getImageUrl());
            }catch (Exception e){
                throw new RuntimeException(e);
            }
        }
        //Update latest KoiFish
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        if (id.equals(latestId)) {
            updateKoiFish(GrowthHistory);
        }
        return growthHistoryMapper.mapToGrowthHistoryDto(growthHistoryRepository.save(GrowthHistory));
    }

    @Override
    public void deleteGrowthHistory(Long id) {
        //TODO: delete then update second koiFish
        GrowthHistory GrowthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("GrowthHistory not found"));
        KoiFish koiFish = GrowthHistory.getKoiFish();
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFish.getId());
        if (growHistories.size() == 1) {
            throw new IllegalArgumentException("GrowthHistory must be at least 1");
        }

        growthHistoryRepository.delete(GrowthHistory);

        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowthHistory GrowthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new IllegalArgumentException("GrowthHistory not found"));

        updateKoiFish(GrowthHistoryLatest);
        growthHistoryRepository.save(GrowthHistoryLatest);
    }

    @Override
    public GrowthHistoryDto getGrowthHistory(Long id) {
        return growthHistoryRepository.findById(id).map(growthHistoryMapper::mapToGrowthHistoryDto).orElseThrow(() -> new IllegalArgumentException("GrowthHistory not found"));
    }

    @Override
    public List<GrowthHistoryDto> getListGrowthHistory(long koiFishId) {
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFishId);
        return growHistories.stream().map(growthHistoryMapper::mapToGrowthHistoryDto).toList();
    }

    private void updateKoiFish(GrowthHistory GrowthHistory) {
        KoiFish koiFish = GrowthHistory.getKoiFish();
        koiFish.setImageUrl(GrowthHistory.getImageUrl());
        koiFish.setPhysique(GrowthHistory.getPhysique());
        koiFish.setLength(GrowthHistory.getLength());
        koiFish.setWeight(GrowthHistory.getWeight());
    }
}