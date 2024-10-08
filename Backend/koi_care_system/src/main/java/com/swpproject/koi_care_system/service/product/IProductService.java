package com.swpproject.koi_care_system.service.product;

import com.swpproject.koi_care_system.dto.ProductDto;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.payload.request.AddProductRequest;
import com.swpproject.koi_care_system.payload.request.ProductUpdateRequest;

import java.util.List;

public interface IProductService {
    Product addProduct(AddProductRequest product);
    Product getProductById(Long id);
    void deleteProductById(Long id);
    Product updateProduct(ProductUpdateRequest product, Long productId);
    List<Product> getAllProducts(int pageNumber, int pageSize, String sortBy, String sortDir);
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductsByName(String name);
    List<Product> getProductsByBrandAndName(String category, String name);
    List<Product> getProductsBySupplier(String supplierName);
    Long countProductsByBrandAndName(String brand, String name);
    List<Product> getProductsByIssueType(Long issueTypeId);


    List<ProductDto> getConvertedProducts(List<Product> products);

    ProductDto convertToDto(Product product);
}