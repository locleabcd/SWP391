package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiFishMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class KoiFishService implements IKoiFishService {
    KoiFishRepository koiFishRepository;
    IKoiPondService koiPondService;
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
                addKoiFishRequest.getKoiPond(),
                addKoiFishRequest.getImageUrl()
        );
        koiFish.setStatus("Alive");
        return koiFishRepository.save(koiFish);
    }
    @Override
    public KoiFish getKoiFishById(Long id) {
        return koiFishRepository.findKoiFishById(id);
    }

    @Override
    public List<KoiFish> getKoiFishByKoiPond(Long koiPondId) {
        return koiFishRepository.findByKoiPondId(koiPondId)
                .orElseThrow(()->new ResourceNotFoundException("No Koi fish found for koi pond with ID: " + koiPondId));
    }

    @Override
    public List<KoiFish> getAllFishByUserId(Long userId) {
        return koiPondService.getKoiPondByUserID(userId).stream().map(koiPond -> {
            return koiFishRepository.findByKoiPondId(koiPond.getId())
                    .orElse(List.of());
        }).flatMap(List::stream).toList();
    }
    @Override
    public void deleteKoiFish(Long id) {
        koiFishRepository.findById(id)
                .ifPresentOrElse(koiFishRepository::delete, ()->{
                    throw new ResourceNotFoundException("Koi fish not found!");
                });
    }

    @Override
    public KoiFish updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId) {
        return Optional.ofNullable(getKoiFishById(koiFishId)).map(oldKoiFish ->{
            oldKoiFish.setName(koiFishUpdateRequest.getName());
            oldKoiFish.setAge(koiFishUpdateRequest.getAge());
            oldKoiFish.setGender(koiFishUpdateRequest.getGender());
            oldKoiFish.setVariety(koiFishUpdateRequest.getVariety());
            oldKoiFish.setPondDate(koiFishUpdateRequest.getPondDate());
            oldKoiFish.setBreeder(koiFishUpdateRequest.getBreeder());
            oldKoiFish.setPrice(koiFishUpdateRequest.getPrice());
            oldKoiFish.setKoiPond(koiFishUpdateRequest.getKoiPond());
            oldKoiFish.setImageUrl(koiFishUpdateRequest.getImageUrl());
            return koiFishRepository.save(oldKoiFish);
        }).orElseThrow(() -> new ResourceNotFoundException("Koi fish not found!"));
    }

    @Override
    public List<KoiFishDto> getConvertedKoiPonds(List<KoiFish> koiFishList) {
        return koiFishList.stream().map(this::convertToDto).toList();
    }

    @Override
    public KoiFishDto convertToDto(KoiFish koifish) {

        return koiFishMapper.toDto(koifish);
    }
}
