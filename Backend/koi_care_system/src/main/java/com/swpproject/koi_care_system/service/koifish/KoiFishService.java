package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiFishMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.models.OriginStateOfFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.repository.OriginStateOfFishRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Period;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class KoiFishService implements IKoiFishService {
    KoiFishRepository koiFishRepository;
    IKoiPondService koiPondService;
    KoiPondRepository koiPondRepository;
    KoiFishMapper koiFishMapper;
    ImageStorage imageStorage;
    OriginStateOfFishRepository originStateOfFishRepository;
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFishDto addKoiFish(AddKoiFishRequest addKoiFishRequest) throws IOException {
        KoiFish koiFish = koiFishMapper.mapToKoiFish(addKoiFishRequest);
        if(addKoiFishRequest.getFile()!=null)
            koiFish.setImageUrl(imageStorage.uploadImage(addKoiFishRequest.getFile()));
        else
            koiFish.setImageUrl("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg");
        koiFish.setStatus("Alive");
        koiFish.setKoiPond(koiPondRepository.findKoiPondsById(addKoiFishRequest.getKoiPondId()));
        koiFish=koiFishRepository.save(koiFish);
        originStateOfFishRepository.save(OriginStateOfFish.builder()
                        .name(koiFish.getName())
                        .age(koiFish.getAge())
                        .physique(koiFish.getPhysique())
                        .variety(koiFish.getVariety())
                        .weight(koiFish.getWeight())
                        .gender(koiFish.getGender())
                        .length(koiFish.getLength())
                        .pondDate(koiFish.getPondDate())
                        .koiFish(koiFish)
                .build());
        return koiFishMapper.toDto(koiFish);
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFishDto getKoiFishById(Long id) {
        return koiFishMapper.toDto(koiFishRepository.findKoiFishById(id));
    }

    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public List<KoiFishDto> getKoiFishByKoiPond(Long koiPondId) {
        return koiFishRepository.findByKoiPondId(koiPondId).stream().map(koiFishMapper::toDto).toList();
    }

    @Override
    public List<KoiFishDto> getAllFishByUserId(Long userId) {
        List<KoiFishDto> koiFishDtos = new ArrayList<>();
        koiPondService.getKoiPondByUserID(userId).forEach(koiPond ->
                koiFishRepository.findByKoiPondId(koiPond.getId()).forEach(koiFish ->{
                            koiFish.setAge(koiFish.getAge()+ Period.between(koiFish.getPondDate(),LocalDate.now()).getYears());
                            koiFishDtos.add(koiFishMapper.toDto(koiFish));
                        }
                )
        );
        return koiFishDtos;
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public void deleteKoiFish(Long id) {
        koiFishRepository.findById(id)
            .ifPresentOrElse(koiFishRepository::delete,()-> {
                throw new ResourceNotFoundException("Koi Fish not found!");
            });
    }

    @Override
    public KoiFishDto getKoiFishByName(String name) {
        return koiFishMapper.toDto(koiFishRepository.findKoiFishByName(name));
    }

    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFishDto updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId) {
        KoiFish oldKoiFish = koiFishRepository.findKoiFishById(koiFishId);
        if(koiFishUpdateRequest.getFile()!=null)
            if(!koiFishUpdateRequest.getFile().isEmpty()){
                try {
                    if (!oldKoiFish.getImageUrl().equals("https://koicaresystemv3.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg"))
                        imageStorage.deleteImage(oldKoiFish.getImageUrl());
                    oldKoiFish.setImageUrl(imageStorage.uploadImage(koiFishUpdateRequest.getFile()));
                }catch (Exception e){
                    throw new RuntimeException(e);
                }
            }
        koiFishUpdateRequest.setKoiPond(koiPondRepository.findKoiPondsById(koiFishUpdateRequest.getKoiPondId()));
        koiFishMapper.updateToKoiFish(oldKoiFish,koiFishUpdateRequest);
        return koiFishMapper.toDto(koiFishRepository.save(oldKoiFish));
    }

    @Override
    public List<KoiFishDto> getKoiFishByUserIdWithCurrentDate(Long userId, LocalDate date) {
        List<KoiFishDto> koiFishDtos = new ArrayList<>();
        koiPondService.getKoiPondByUserID(userId).forEach(koiPond ->
                koiFishRepository.findByKoiPondId(koiPond.getId()).forEach(koiFish ->
                        koiFishDtos.add(koiFishMapper.toDto(koiFish))
                )
        );
        return koiFishDtos.stream().filter(koiFishDto -> koiFishDto.getPondDate().equals(date)).toList();
    }
}