package com.swpproject.koi_care_system.service.product;
import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.enums.PromotionStatus;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.ImageMapper;
import com.swpproject.koi_care_system.mapper.ProductMapper;
import com.swpproject.koi_care_system.models.*;
import com.swpproject.koi_care_system.payload.request.AddProductRequest;
import com.swpproject.koi_care_system.payload.request.ProductUpdateRequest;
import com.swpproject.koi_care_system.repository.*;
import com.swpproject.koi_care_system.service.promotion.IPromotionService;
import com.swpproject.koi_care_system.service.promotion.PromotionService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final SupplierRepository supplierRepository;
    private final IPromotionService promotionService;
    private final IssueTypeRepository issueTypeRepository;

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Product addProduct(AddProductRequest request) {
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);
        Supplier supplier = supplierRepository.findByName(request.getSupplierName());
        Product product=createProduct(request, category,supplier);
        if(request.getInventory()>0)
            product.setStatus(true);
        if (!request.getIssueTypeId().isEmpty()) {
            Set<IssueType> issueTypes = new HashSet<>();
            for (Long issueTypeId : request.getIssueTypeId()) {
                IssueType issueType = new IssueType();
                issueType.setId(issueTypeId);
                issueTypes.add(issueType);
            }
            product.setIssues(issueTypes);
        }
        return productRepository.save(product);
    }
    private Product createProduct(AddProductRequest request, Category category, Supplier supplier) {
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getDescription(),
                request.getDescription_detail(),
                category,
                supplier
        );
    }
    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found!"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public void deleteProductById(Long id) {
        productRepository.findById(id)
                .map(existingProduct -> {
                    existingProduct.setStatus(false);
                    return existingProduct;
                })
                .map(productRepository :: save)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found!"));
    }

    @Override
    @PreAuthorize("hasRole('ADMIN') or hasRole('SHOP')")
    public Product updateProduct(ProductUpdateRequest request, Long productId) {
        return productRepository.findById(productId)
                .map(existingProduct -> updateExistingProduct(existingProduct,request))
                .map(productRepository :: save)
                .orElseThrow(()-> new ResourceNotFoundException("Product not found!"));
    }

    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest request) {
        existingProduct.setName(request.getName());
        existingProduct.setBrand(request.getBrand());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setInventory(request.getInventory());
        existingProduct.setDescription(request.getDescription());
        existingProduct.setDescription_detail(request.getDescription_detail());
        Supplier supplier = supplierRepository.findByName(request.getSupplierName());
        Category category = categoryRepository.findByName(request.getCategory().getName());
        existingProduct.setSupplier(supplier);
        existingProduct.setCategory(category);
        existingProduct.setStatus((request.getInventory() > 0));
        Set<IssueType> issueTypes = new HashSet<>();
        for (Long issueID : request.getIssueTypeId()){
            IssueType issueType = issueTypeRepository.findById(issueID).orElseThrow(()->new RuntimeException("Issue Type not found"));
            issueTypes.add(issueType);
        }
        existingProduct.setIssues(issueTypes);
        return  existingProduct;

    }
    @Override
    public List<Product> getAllProducts(int pageNumber, int pageSize, String sortBy, String sortDir) {
        Sort sort = ("Asc".equalsIgnoreCase(sortDir)) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        promotionService.upToDate();
        List<Product> productsTmp = productRepository.findAllAvaiable();
        productsTmp.forEach(product->{
            updateProductRating(product);
            product.getPromotions().forEach(promotion -> {
                product.getPromotions().removeIf(promotion1 -> {
                    return promotion1.getStatus().equals(PromotionStatus.ENDED);
                });
            });
        });
        Page<Product> products = productRepository.findAll(pageable);
        return products.stream().toList();
    }
    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return productRepository.findByBrandAndName(brand, name);
    }

    @Override
    public List<Product> getProductsBySupplier(String supplierName) {
        return productRepository.findBySupplierName(supplierName);
    }

    @Override
    public Long countProductsByBrandAndName(String brand, String name) {
        return productRepository.countByBrandAndName(brand, name);
    }

    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }
    @Override
    public ProductDto convertToDto(Product product) {
        ProductDto productDto = productMapper.mapToProductDto(product);

        List<Image> images = imageRepository.findByProductId(product.getId());
        List<ImageDto> imageDtos = images.stream()
                .map(imageMapper::mapToImageDto)
                .toList();
        productDto.setImages(imageDtos);

        List<PromotionDto> promotionDtos = product.getPromotions().stream()
                .map(productMapper::mapToPromotionDto)
                .toList();
        productDto.setPromotions(promotionDtos);
        return productDto;
    }
    @Override
    public List<Product> getProductsByIssueType(Long issueTypeId) {
        IssueType issueType = issueTypeRepository.findById(issueTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("IssueType not found!"));
        return productRepository.findByIssues(issueType);
    }
    private void updateProductRating(Product product) {
        product.updateRating();
        productRepository.save(product);
    }
}
