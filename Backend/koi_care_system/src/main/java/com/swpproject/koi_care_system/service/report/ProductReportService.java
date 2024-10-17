package com.swpproject.koi_care_system.service.report;

import com.swpproject.koi_care_system.dto.OrderDto;
import com.swpproject.koi_care_system.dto.OrderItemDto;
import com.swpproject.koi_care_system.dto.ProductCategoryReportDto;
import com.swpproject.koi_care_system.dto.ProductReportDto;
import com.swpproject.koi_care_system.models.Category;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.service.category.ICategoryService;
import com.swpproject.koi_care_system.service.order.IOrderService;
import com.swpproject.koi_care_system.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductReportService {
    private final IOrderService orderService;
    private final IProductService productService;
    private final ICategoryService categoryService;
    public List<ProductReportDto> getProductReport(){
        List<OrderDto> orderDtos = orderService.getOrdersInOneMonth();
        List<Product> allProducts = productService.getAllProducts();

        Map<String, ProductReportDto> productReportMap = allProducts.stream()
                .collect(Collectors.toMap(
                        Product::getName,
                        product -> ProductReportDto.builder()
                                .id(product.getId())
                                .imageUrl((!product.getImages().isEmpty())?product.getImages().get(0).getDownloadUrl():"")
                                .productName(product.getName())
                                .categoryName(product.getCategory().getName())
                                .quantity(0L)
                                .totalPrice(BigDecimal.ZERO)
                                .build()
                ));
        AtomicLong totalQuantity = new AtomicLong(0L);

        for (OrderDto orderDto : orderDtos) {
            for (OrderItemDto orderItemDto : orderDto.getItems()) {
                ProductReportDto reportDto = productReportMap.get(orderItemDto.getProductName());
                if (reportDto != null) {
                    long orderQuantity = orderItemDto.getQuantity();
                    reportDto.setQuantity(reportDto.getQuantity() + orderQuantity);
                    if(!"Premium Plan".equals(reportDto.getCategoryName()))
                        totalQuantity.addAndGet(orderQuantity);

                    reportDto.setTotalPrice(reportDto.getTotalPrice().add(
                            orderItemDto.getPrice().multiply(BigDecimal.valueOf(orderQuantity))
                    ));
                }

            }
        }
        BigDecimal totalQuantityBigDecimal = BigDecimal.valueOf(totalQuantity.get());
        if (totalQuantityBigDecimal.compareTo(BigDecimal.ZERO) > 0) {
            productReportMap.values().forEach(reportDto -> {
                BigDecimal quantityBigDecimal = BigDecimal.valueOf(reportDto.getQuantity());
                BigDecimal percent = quantityBigDecimal
                        .multiply(BigDecimal.valueOf(100))
                        .divide(totalQuantityBigDecimal, 2, RoundingMode.HALF_UP);
                reportDto.setPercent(percent.doubleValue());
            });
        }
        return productReportMap.values().stream()
                .filter(reportDto -> !"Premium Plan".equals(reportDto.getCategoryName()))
                .sorted((r1, r2) -> r2.getPercent().compareTo(r1.getPercent()))
                .toList();
    }

    public List<ProductCategoryReportDto> getProductCategoryReport(){
        List<ProductReportDto> reportDtos = this.getProductReport();
        Map<String,ProductCategoryReportDto> productCategoryReportDtoMap =categoryService.getAllCategories().stream()
                .collect(Collectors.toMap(
                        Category::getName,
                        category -> ProductCategoryReportDto.builder()
                                .categoryName(category.getName())
                                .percent(0.0)
                                .quantity(0L)
                                .totalPrice(BigDecimal.ZERO)
                                .build()
                ));

        for (ProductReportDto reportDto : reportDtos) {
            ProductCategoryReportDto categoryReportDto = productCategoryReportDtoMap.get(reportDto.getCategoryName());
            categoryReportDto.setQuantity(categoryReportDto.getQuantity() + reportDto.getQuantity());
            categoryReportDto.setTotalPrice(categoryReportDto.getTotalPrice().add(reportDto.getTotalPrice()));
        }

        BigDecimal overallTotalPrice = productCategoryReportDtoMap.values().stream()
                .map(ProductCategoryReportDto::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        if (overallTotalPrice.compareTo(BigDecimal.ZERO) > 0) {
            productCategoryReportDtoMap.values().forEach(categoryReportDto -> {
                BigDecimal categoryTotalPrice = categoryReportDto.getTotalPrice();
                BigDecimal percent = categoryTotalPrice
                        .multiply(BigDecimal.valueOf(100))
                        .divide(overallTotalPrice, 2, RoundingMode.HALF_UP);
                categoryReportDto.setPercent(percent.doubleValue());
            });
        }
        return productCategoryReportDtoMap.values().stream()
                .filter(productCategoryReportDto -> !"Premium Plan".equals(productCategoryReportDto.getCategoryName()))
                .sorted((r1,r2)->r2.getPercent().compareTo(r1.getPercent()))
                .toList();
    }
}
