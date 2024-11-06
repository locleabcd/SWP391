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
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.Comparator;
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
        KoiFish koiFish = koiFishRepository.findById(growthCreateRequest.getKoiFishId()).orElseThrow(() -> new AppException(ErrorCode.KOI_FISH_NOT_FOUND));
        GrowthHistory growthHistory = growthHistoryMapper.mapToGrowthHistory(growthCreateRequest);
        if (growthCreateRequest.getFile() != null) {
            growthHistory.setImageUrl(imageStorage.uploadImage(growthCreateRequest.getFile()));
        }
        else
            growthHistory.setImageUrl("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png");
        growthHistory.setKoiFish(koiFish);
        GrowthHistory savedGrowthHistory = growthHistoryRepository.save(growthHistory);
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        if (savedGrowthHistory.getId() == latestId) {
            String imageUrl = (savedGrowthHistory.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png") ?
                    koiFish.getImageUrl() : savedGrowthHistory.getImageUrl());
            //Update KoiFish
            updateKoiFish(savedGrowthHistory,imageUrl);
            koiFishRepository.save(koiFish);
        }
        return growthHistoryMapper.mapToGrowthHistoryDto(savedGrowthHistory);
    }

    @Override
    public GrowthHistoryDto updateGrowthHistory(Long id, GrowthUpdateRequest growthUpdateRequest) {
        GrowthHistory growthHistory = growthHistoryRepository.findById(id).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        growthHistoryMapper.updateGrowthHistory(growthHistory, growthUpdateRequest);
        if (growthUpdateRequest.getFile() != null)
            try {
                if (!growthHistory.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png"))
                    imageStorage.deleteImage(growthHistory.getImageUrl());
                growthHistory.setImageUrl(imageStorage.uploadImage(growthUpdateRequest.getFile()));
            } catch (Exception e) {
                throw new RuntimeException(e);
            }
        GrowthHistory updatedGrowthHistory = growthHistoryRepository.save(growthHistory);
        KoiFish koiFish = growthHistory.getKoiFish();
        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        //Update latest KoiFish
        GrowthHistory growthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        updateKoiFish(growthHistoryLatest, (growthHistoryLatest.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png") ? koiFish.getImageUrl() : growthHistoryLatest.getImageUrl()));
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
        if (!growthHistory.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png"))
            try{
                if(!koiFish.getImageUrl().equals(growthHistory.getImageUrl()))
                    imageStorage.deleteImage(growthHistory.getImageUrl());
            }catch (Exception e){
                throw new RuntimeException(e);
            }
        growthHistoryRepository.delete(growthHistory);

        long latestId = growthHistoryRepository.findLatestByKoiFishId(koiFish.getId());
        GrowthHistory growthHistoryLatest = growthHistoryRepository.findById(latestId).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
        updateKoiFish(growthHistoryLatest, growthHistoryLatest.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultGrowthHistory.png") ? koiFish.getImageUrl() : growthHistoryLatest.getImageUrl());
        growthHistoryRepository.save(growthHistoryLatest);
    }

    @Override
    public GrowthHistoryDto getGrowthHistory(Long id) {
        return growthHistoryRepository.findById(id).map(growthHistoryMapper::mapToGrowthHistoryDto).orElseThrow(() -> new AppException(ErrorCode.GROWTH_HISTORY_NOT_FOUND));
    }

    @Override
    public List<GrowthHistoryDto> getListGrowthHistory(long koiFishId) {
        List<GrowthHistory> growHistories = growthHistoryRepository.findAllByKoiFishId(koiFishId);
        return growHistories.stream().map(growthHistoryMapper::mapToGrowthHistoryDto).sorted(Comparator.comparing(GrowthHistoryDto::getCreateDate)).toList();
    }

    private void updateKoiFish(GrowthHistory growthHistory, String imageUrl) {
        KoiFish koiFish = growthHistory.getKoiFish();
        koiFish.setImageUrl(imageUrl);
        koiFish.setPhysique(growthHistory.getPhysique());
        koiFish.setLength(growthHistory.getLength());
        koiFish.setWeight(growthHistory.getWeight());
    }
}