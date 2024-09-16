package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.dto.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.model.KoiPond;

public interface IKoiPondService {
    KoiPond createKoiPond(AddKoiPondRequest addKoiPondRequest);
    KoiPond getKoiPondById(Long id);
    void deleteKoiPond(Long id);
    KoiPond updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId );

}
