package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;

import java.util.List;

public interface IKoiFishService {

    KoiFish addKoiFish(AddKoiFishRequest addKoiFishRequest);

    KoiFish getKoiFishById(Long id);

    List<KoiFish> getKoiFishByKoiPond(Long koiPondId);
    List<KoiFish> getAllFishByUserId(Long userId);

    void deleteKoiFish(Long id);

    KoiFish updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId);

    List<KoiFishDto> getConvertedKoiPonds (List<KoiFish> koiFishList);

    KoiFishDto convertToDto(KoiFish koiFish);


}
