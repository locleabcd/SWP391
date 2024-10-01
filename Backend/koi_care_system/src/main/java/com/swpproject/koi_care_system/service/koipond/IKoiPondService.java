package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.models.KoiPond;

import java.io.IOException;
import java.util.List;

public interface IKoiPondService {

    KoiPond addKoiPond(AddKoiPondRequest addKoiPondRequest) throws IOException;
    KoiPond getKoiPondById(Long id);
    List<KoiPond> getKoiPondByUserID(Long userID);
    void deleteKoiPond(Long id);
    KoiPond updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId );
    List<KoiPondDto> getConvertedKoiPonds(List<KoiPond> koiPonds);
    KoiPondDto convertToDto(KoiPond koiPond);



}