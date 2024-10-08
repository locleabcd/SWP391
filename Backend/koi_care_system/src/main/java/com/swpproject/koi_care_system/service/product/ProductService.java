package com.swpproject.koi_care_system.service.product;

import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.mapper.ProductMapper;
import com.swpproject.koi_care_system.models.Category;
import com.swpproject.koi_care_system.models.IssueType;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.payload.request.AddProductRequest;
import com.swpproject.koi_care_system.payload.request.ProductUpdateRequest;
import com.swpproject.koi_care_system.repository.CategoryRepository;
import com.swpproject.koi_care_system.repository.IssueTypeRepository;
import com.swpproject.koi_care_system.repository.ProductRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ProductService implements IProductService {
    ProductRepository productRepository;
    CategoryRepository categoryRepository;
    ProductMapper productMapper;  // Inject ProductMapper
    IssueTypeRepository issueTypeRepository;

    public Product addProduct(AddProductRequest request) {
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName()))
                .orElseGet(() -> {
                    Category newCategory = new Category(request.getCategory().getName());
                    return categoryRepository.save(newCategory);
                });
        request.setCategory(category);
        Product product = createProduct(request, category);

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

    private Product createProduct(AddProductRequest request, Category category) {
        return new Product(
                request.getName(),
                request.getBrand(),
                request.getPrice(),
                request.getInventory(),
                request.getDescription(),
                category
        );
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    public void deleteProductById(Long id) {
        productRepository.findById(id)
                .ifPresentOrElse(productRepository::delete,
                        () -> {
                            throw new ResourceNotFoundException("Product not found!");
                        });
    }

    public Product updateProduct(ProductUpdateRequest request, Long productId) {
        return productRepository.findById(productId)
                .map(existingProduct -> updateExistingProduct(existingProduct, request))
                .map(productRepository::save)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found!"));
    }

    private Product updateExistingProduct(Product existingProduct, ProductUpdateRequest request) {
        existingProduct.setName(request.getName());
        existingProduct.setBrand(request.getBrand());
        existingProduct.setPrice(request.getPrice());
        existingProduct.setInventory(request.getInventory());
        existingProduct.setDescription(request.getDescription());

        Category category = categoryRepository.findByName(request.getCategory().getName());
        existingProduct.setCategory(category);
        return existingProduct;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    public List<Product> getProductsByName(String name) {
        return productRepository.findByName(name);
    }

    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return productRepository.findByBrandAndName(brand, name);
    }

    public Long countProductsByBrandAndName(String brand, String name) {
        return productRepository.countByBrandAndName(brand, name);
    }

    @Override
    public List<Product> getProductsByIssueType(Long issueTypeId) {
        IssueType issueType = issueTypeRepository.findById(issueTypeId)
                .orElseThrow(() -> new ResourceNotFoundException("IssueType not found!"));
        return productRepository.findByIssues(issueType);
    }

    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    public ProductDto convertToDto(Product product) {
        return productMapper.toDto(product);
    }
}
