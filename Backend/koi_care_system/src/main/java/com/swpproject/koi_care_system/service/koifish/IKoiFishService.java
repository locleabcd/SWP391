package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface IKoiFishService {

    KoiFishDto addKoiFish(AddKoiFishRequest addKoiFishRequest) throws IOException;

    KoiFishDto getKoiFishById(Long id);

    List<KoiFishDto> getKoiFishByKoiPond(Long koiPondId);
    List<KoiFishDto> getAllFishByUserId(Long userId);

    void deleteKoiFish(Long id);
    KoiFishDto getKoiFishByName(String name);

    KoiFishDto updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId);

    List<KoiFishDto> getKoiFishByUserIdWithCurrentDate(Long userId, LocalDate date);

}
