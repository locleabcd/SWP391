package com.swpproject.koi_care_system.service.promotion;

import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.exceptions.AlreadyExistsException;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.PromotionMapper;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.models.Promotion;
import com.swpproject.koi_care_system.payload.request.AddPromotionRequest;
import com.swpproject.koi_care_system.payload.request.PromotionUpdateRequest;
import com.swpproject.koi_care_system.repository.ProductRepository;
import com.swpproject.koi_care_system.repository.PromotionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PromotionService implements IPromotionService {

    private final PromotionRepository promotionRepository;
    private final PromotionMapper promotionMapper;
    @Autowired
    private final ProductRepository productRepository;
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public PromotionDto createPromotion(AddPromotionRequest addPromotionRequest) {
        if(promotionRepository.existsByName(addPromotionRequest.getName())){
            throw new AlreadyExistsException("A Promotion with this name already exists");
        }
        Promotion promotion = promotionMapper.mapToPromotion(addPromotionRequest);
        promotionRepository.save(promotion);
        return promotionMapper.mapToDto(promotion);

    }
    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public PromotionDto updatePromotion(Long id, PromotionUpdateRequest promotionUpdateRequest) {
        Promotion promotion = promotionRepository.findById(promotionUpdateRequest.getId())
                .orElseThrow(()-> new ResourceNotFoundException("No promotion found with this id"));
        promotionMapper.updatePromotion(promotion,promotionUpdateRequest);
        return promotionMapper.mapToDto(promotionRepository.save(promotion));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void deletePromotion(Long id) {
        promotionRepository.findById(id).ifPresentOrElse(promotionRepository::delete,()->{
            throw new ResourceNotFoundException("No promotion found with this id");
        });
    }

    @Override
    public PromotionDto getPromotionById(Long id) {
        return promotionMapper.mapToDto(promotionRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("No promotion found with this id")));
    }

    @Override
    public List<PromotionDto> getAllPromotions() {
        return promotionRepository.findAll().stream().map(promotionMapper::mapToDto).toList();
    }

    @Override
    public void addProductsToPromotion(Long promotionId, List<Long> productIds) {
        Promotion promotion = promotionRepository.findById(promotionId)
                .orElseThrow(() -> new ResourceNotFoundException("Promotion not found with id: " + promotionId));

        List<Product> products = productRepository.findAllById(productIds);
        for (Product product : products) {
            product.getPromotions().add(promotion);
            promotion.getProducts().add(product);
        }
        productRepository.saveAll(products);
        promotionRepository.save(promotion);
    }
}