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
    public KoiPond addKoiPond(AddKoiPondRequest request) {
        if (koiPondRepository.existsByName(request.getName())) {
            throw new AlreadyExistsException("A Koi Pond with this name already exists");
        }
        KoiPond koiPond = new KoiPond(
                null,
                request.getName(),
                request.getDrainCount(),
                request.getDepth(),
                request.getSkimmer(),
                request.getPumpCapacity(),
                request.getVolume(),
                request.getUser(),
                request.getImageUrl()
        );
        return koiPondRepository.save(koiPond);
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
                .ifPresentOrElse(koiPond->{
                    try{
                        if(!koiPond.getImageUrl().isEmpty())
                            imageStorage.deleteImage(koiPond.getImageUrl());
                        koiPondRepository.delete(koiPond);
                    }catch (Exception e){
                        throw new RuntimeException("Failed to delete the koi pond" + e.getMessage());
                    }
                },()->{
                    throw new ResourceNotFoundException("Koi Pond not found!");
                });
    }
    @Override
    @PreAuthorize("hasRole('MEMBER')")
    public KoiPond updateKoiPond(KoiPondUpdateRequest koiPondUpdateRequest, Long koiPondId) {
        return Optional.ofNullable(getKoiPondById(koiPondId)).map(oldKoiPond -> {
            if(!oldKoiPond.getImageUrl().isEmpty()) {
                try {
                    imageStorage.deleteImage(oldKoiPond.getImageUrl());
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            }
            oldKoiPond.setName(koiPondUpdateRequest.getName());
            oldKoiPond.setDepth(koiPondUpdateRequest.getDepth());
            oldKoiPond.setDrainCount(koiPondUpdateRequest.getDrainCount());
            oldKoiPond.setVolume(koiPondUpdateRequest.getVolume());
            oldKoiPond.setSkimmer(koiPondUpdateRequest.getSkimmer());
            oldKoiPond.setPumpCapacity(koiPondUpdateRequest.getPumpCapacity());
            oldKoiPond.setImageUrl(koiPondUpdateRequest.getImageUrl());
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