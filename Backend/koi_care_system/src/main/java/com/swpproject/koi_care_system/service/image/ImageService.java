package com.swpproject.koi_care_system.service.image;

import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.Image;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.repository.ImageRepository;
import com.swpproject.koi_care_system.service.imageBlobStorage.AzureImageStorage;
import com.swpproject.koi_care_system.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;
    private final IProductService productService;
    private final AzureImageStorage imageStorage;
    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("No image found with id: " + id));
    }
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void deleteImageById(Long id) {
        imageRepository.findById(id).ifPresentOrElse(image -> {
            try {
                imageStorage.deleteImage(image.getDownloadUrl());
                imageRepository.delete(image);
            } catch (Exception e) {
                throw new RuntimeException("Failed to delete image: " + e.getMessage());
            }
        }, () -> {
            throw new ResourceNotFoundException("No image found with id: " + id);
        });
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public List<ImageDto> saveImages(Long productId, List<MultipartFile> files) {
        Product product = productService.getProductById(productId);

        List<ImageDto> savedImageDto = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                String imageUrl = imageStorage.uploadImage(file);

                Image image = new Image();
                image.setDownloadUrl(imageUrl);
                image.setProduct(product);

                Image savedImage = imageRepository.save(image);

                ImageDto imageDto = new ImageDto();
                imageDto.setId(savedImage.getId());
                imageDto.setDownloadUrl(savedImage.getDownloadUrl());
                savedImageDto.add(imageDto);

            } catch (Exception e) {
                throw new RuntimeException("Failed to upload image: " + e.getMessage());
            }
        }
        return savedImageDto;
    }
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageById(imageId);
        try {
            imageStorage.deleteImage(image.getDownloadUrl());

            String newImageUrl = imageStorage.uploadImage(file);
            image.setDownloadUrl(newImageUrl);

            imageRepository.save(image);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update image: " + e.getMessage());
        }
    }
}
