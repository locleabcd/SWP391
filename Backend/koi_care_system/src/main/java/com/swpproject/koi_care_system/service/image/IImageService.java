package com.swpproject.koi_care_system.service.image;


import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.models.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    Image getImageById(Long id);
    void deleteImageById(Long id);
    List<ImageDto> saveImages(Long productId, List<MultipartFile> files);
    void updateImage(MultipartFile file,  Long imageId);
}