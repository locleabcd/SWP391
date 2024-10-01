package com.swpproject.koi_care_system.service.product;
import com.swpproject.koi_care_system.dto.ImageDto;
import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.dto.PromotionDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.ImageMapper;
import com.swpproject.koi_care_system.mapper.ProductMapper;
import com.swpproject.koi_care_system.models.Category;
import com.swpproject.koi_care_system.models.Image;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.models.Supplier;
import com.swpproject.koi_care_system.payload.request.AddProductRequest;
import com.swpproject.koi_care_system.payload.request.ProductUpdateRequest;
import com.swpproject.koi_care_system.repository.CategoryRepository;
import com.swpproject.koi_care_system.repository.ImageRepository;
import com.swpproject.koi_care_system.repository.ProductRepository;
import com.swpproject.koi_care_system.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;
    private final ImageRepository imageRepository;
    private final ImageMapper imageMapper;
    private final SupplierRepository supplierRepository;
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
        return productRepository.save(createProduct(request, category,supplier));
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
                .ifPresentOrElse(productRepository::delete,
                        () -> {throw new ResourceNotFoundException("Product not found!");});
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
        return  existingProduct;

    }
    @Override
    public List<Product> getAllProducts(int pageNumber, int pageSize, String sortBy, String sortDir) {
        Sort sort = ("Asc".equalsIgnoreCase(sortDir)) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(pageNumber, pageSize, sort);
        List<Product> productsTmp = productRepository.findAll();
        productsTmp.forEach(this::updateProductRating);
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
    private void updateProductRating(Product product) {
        product.updateRating();
        productRepository.save(product);
    }
}