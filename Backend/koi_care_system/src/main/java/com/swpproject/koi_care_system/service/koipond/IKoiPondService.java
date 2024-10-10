package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.models.KoiPond;

import java.io.IOException;
import java.util.List;

public interface IKoiPondService {

    KoiPondDto addKoiPond(AddKoiPondRequest addKoiPondRequest) throws IOException;
    KoiPondDto getKoiPondById(Long id);
    List<KoiPondDto> getKoiPondByUserID(Long userID);
    void deleteKoiPond(Long id);
    KoiPondDto updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId );
}