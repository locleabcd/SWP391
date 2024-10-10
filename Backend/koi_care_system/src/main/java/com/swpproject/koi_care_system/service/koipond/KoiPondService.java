package com.swpproject.koi_care_system.service.koipond;

import com.swpproject.koi_care_system.dto.KoiPondDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.KoiPondMapper;
import com.swpproject.koi_care_system.payload.request.AddKoiPondRequest;
import com.swpproject.koi_care_system.payload.request.KoiPondUpdateRequest;
import com.swpproject.koi_care_system.models.KoiPond;
import com.swpproject.koi_care_system.repository.KoiPondRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.ImageStorage;
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
public class KoiPondService implements IKoiPondService {
    KoiPondRepository koiPondRepository;
    KoiPondMapper koiPondMapper;
    ImageStorage imageStorage;
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPond addKoiPond(AddKoiPondRequest addKoiPondRequest) throws IOException {
        if (koiPondRepository.existsByNameAndUserId(addKoiPondRequest.getName(), addKoiPondRequest.getUser().getId())) {
            throw new AlreadyExistsException("Koi Pond with name " + addKoiPondRequest.getName() + " already exists!");
        }
        if(addKoiPondRequest.getFile()!=null)
            addKoiPondRequest.setImageUrl(!addKoiPondRequest.getFile().isEmpty()?imageStorage.uploadImage(addKoiPondRequest.getFile()):"https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg");
        else
            addKoiPondRequest.setImageUrl("https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg");
        return koiPondRepository.save(koiPondMapper.mapToKoiPond(addKoiPondRequest));
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPond getKoiPondById(Long id) {
        return koiPondRepository.findKoiPondsById(id);
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public List<KoiPond> getKoiPondByUserID(Long userID) {
        return  koiPondRepository.findByUserId(userID)
                .orElseThrow(() -> new ResourceNotFoundException("No Koi Ponds found for user with ID: " + userID));
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public void deleteKoiPond(Long id) {
        koiPondRepository.findById(id)
                .ifPresentOrElse(koiPondRepository::delete,()-> {
                    throw new ResourceNotFoundException("Koi Pond not found!");
                });

    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPond updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId) {
        return Optional.ofNullable(getKoiPondById(koiPondId)).map(oldKoiPond -> {
            if(koiPondUpdateRequest.getFile()!=null) {
                if(!koiPondUpdateRequest.getFile().isEmpty())
                    try {
                        if(!oldKoiPond.getImageUrl().equals("https://koicareimage.blob.core.windows.net/koicarestorage/defaultKoiPond.jpg"))
                            imageStorage.deleteImage(oldKoiPond.getImageUrl());
                        oldKoiPond.setImageUrl(imageStorage.uploadImage(koiPondUpdateRequest.getFile()));
                    } catch (IOException e) {
                        throw new RuntimeException(e);
                    }
            }
            koiPondMapper.updateToKoiPond(oldKoiPond,koiPondUpdateRequest);
            return koiPondRepository.save(oldKoiPond);
        }).orElseThrow(() -> new ResourceNotFoundException("Koi pond not found!"));
    }
    @Override
    public List<KoiPondDto> getConvertedKoiPonds(List<KoiPond> koiPonds) {
        return koiPonds.stream().map(this::convertToDto).toList();
    }
    @Override
    public KoiPondDto convertToDto(KoiPond koiPond) {
        return koiPondMapper.toDto(koiPond);
    }
}