package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiFishMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class KoiFishService implements IKoiFishService {
    KoiFishRepository koiFishRepository;
    IKoiPondService koiPondService;
    KoiPondRepository koiPondRepository;
    KoiFishMapper koiFishMapper;
    ImageStorage imageStorage;
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFishDto addKoiFish(AddKoiFishRequest addKoiFishRequest) throws IOException {
        if(koiFishRepository.existsByName(addKoiFishRequest.getName())){
            throw new AlreadyExistsException("A Koi fish with this name already exists");
        }
        KoiFish koiFish = koiFishMapper.mapToKoiFish(addKoiFishRequest);
        if(addKoiFishRequest.getFile()!=null)
            koiFish.setImageUrl(!addKoiFishRequest.getFile().isEmpty()?imageStorage.uploadImage(addKoiFishRequest.getFile()):"https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg");
        else
            koiFish.setImageUrl("https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg");
        koiFish.setStatus("Alive");
        koiFish.setKoiPond(koiPondRepository.findKoiPondsById(addKoiFishRequest.getKoiPondId()));
        return koiFishMapper.toDto(koiFishRepository.save(koiFish));
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
                koiFishRepository.findByKoiPondId(koiPond.getId()).forEach(koiFish ->
                        koiFishDtos.add(koiFishMapper.toDto(koiFish))
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
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFishDto updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId) {
        KoiFish oldKoiFish = koiFishRepository.findKoiFishById(koiFishId);
        if(koiFishUpdateRequest.getFile()!=null)
            if(!koiFishUpdateRequest.getFile().isEmpty()){
                try {
                    if(!oldKoiFish.getImageUrl().equals("https://koicaresystem.blob.core.windows.net/koicare-blob/defaultKoiFish.jpeg"))
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
}