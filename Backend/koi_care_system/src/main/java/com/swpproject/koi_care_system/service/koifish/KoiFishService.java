package com.swpproject.koi_care_system.service.koifish;

import com.swpproject.koi_care_system.dto.KoiFishDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiFishMapper;
import com.swpproject.koi_care_system.models.KoiFish;
import com.swpproject.koi_care_system.payload.request.AddKoiFishRequest;
import com.swpproject.koi_care_system.payload.request.KoiFishUpdateRequest;
import com.swpproject.koi_care_system.repository.KoiFishRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
import com.swpproject.koi_care_system.service.koipond.IKoiPondService;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)

public class KoiFishService implements IKoiFishService {
    KoiFishRepository koiFishRepository;
    IKoiPondService koiPondService;
    KoiFishMapper koiFishMapper;
    ImageStorage imageStorage;
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFish addKoiFish(AddKoiFishRequest addKoiFishRequest) throws IOException {
        if(koiFishRepository.existsByName(addKoiFishRequest.getName())){
            throw new AlreadyExistsException("A Koi fish with this name already exists");
        }
        addKoiFishRequest.setKoiPond(koiPondService.getKoiPondById(addKoiFishRequest.getKoiPondId()));
        if(addKoiFishRequest.getFile()!=null)
            addKoiFishRequest.setImageUrl(!addKoiFishRequest.getFile().isEmpty()?imageStorage.uploadImage(addKoiFishRequest.getFile()):"https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg");
        else
            addKoiFishRequest.setImageUrl("https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiFish.jpeg");
        KoiFish koiFish = koiFishMapper.mapToKoiFish(addKoiFishRequest);
        koiFish.setStatus("Alive");
        return koiFishRepository.save(koiFish);
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiFish getKoiFishById(Long id) {
        return koiFishRepository.findKoiFishById(id);
    }

    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public List<KoiFish> getKoiFishByKoiPond(Long koiPondId) {
        return koiFishRepository.findByKoiPondId(koiPondId)
                .orElseThrow(()->new ResourceNotFoundException("No Koi fish found for koi pond with ID: " + koiPondId));
    }

    @Override
    public List<KoiFish> getAllFishByUserId(Long userId) {
        return koiPondService.getKoiPondByUserID(userId).stream().map(koiPond -> koiFishRepository.findByKoiPondId(koiPond.getId())
                .orElse(List.of())).flatMap(List::stream).toList();
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
    public KoiFish updateKoiFish(KoiFishUpdateRequest koiFishUpdateRequest, Long koiFishId) {
        return Optional.ofNullable(getKoiFishById(koiFishId)).map(oldKoiFish ->{
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
            koiFishUpdateRequest.setKoiPond(koiPondService.getKoiPondById(koiFishUpdateRequest.getKoiPondId()));
            koiFishMapper.updateToKoiFish(oldKoiFish,koiFishUpdateRequest);
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