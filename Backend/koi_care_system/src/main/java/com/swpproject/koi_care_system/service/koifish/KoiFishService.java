package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.mapper.KoiFishMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;

import java.util.List;

public class KoiFishService implements IKoiFishService {
    KoiFishRepository koiFishRepository;
    KoiFishMapper koiFishMapper;
    @Override
    public KoiFish addKoiFish(AddKoiFishRequest addKoiFishRequest) {
        if(koiFishRepository.existsByName(addKoiFishRequest.getName())){
            throw new AlreadyExistsException("A Koi fish with this name already exists");
        }
        KoiFish koiFish = new KoiFish(
                null,
                addKoiFishRequest.getName(),
                addKoiFishRequest.getPhysique(),
                addKoiFishRequest.getAge(),
                addKoiFishRequest.getLength(),
                addKoiFishRequest.getWeight(),
                addKoiFishRequest.getGender(),
                addKoiFishRequest.getVariety(),
                addKoiFishRequest.getPondDate(),
                addKoiFishRequest.getBreeder(),
                addKoiFishRequest.getPrice(),
                addKoiFishRequest.getImageUrl(),
                addKoiFishRequest.getKoiPond()
        );
        koiFish.setStatus("Alive");
        return koiFishRepository.save(koiFish);
    }
    @Override
    public KoiFish getKoiFishById(Long id) {
        return null;
    }

    @Override
    public List<KoiFish> getKoiFishByKoiPond(Long koiPondId) {
        return null;
    }

    @Override
    public void deleteKoiFish(Long id) {

    }

    @Override
    public KoiFish updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId) {
        return null;
    }

    @Override
    public List<KoiFishDto> getConvertedKoiPonds(List<KoiFish> koiFishs) {
        return null;
    }

    @Override
    public KoiFishDto convertToDto(KoiPond koiPond) {
        return null;
    }
}
