package com.swpproject.koi_care_system.service.cart;

import com.swpproject.koi_care_system.exceptions.ResourceNotFoundException;
import com.swpproject.koi_care_system.models.Cart;
import com.swpproject.koi_care_system.models.CartItem;
import com.swpproject.koi_care_system.models.Product;
import com.swpproject.koi_care_system.repository.CartItemRepository;
import com.swpproject.koi_care_system.repository.CartRepository;
import com.swpproject.koi_care_system.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class CartItemService  implements ICartItemService{
    private final CartItemRepository cartItemRepository;
    private final CartRepository cartRepository;
    private final IProductService productService;
    private final ICartService cartService;

    @Override
    public void addItemToCart(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        Product product = productService.getProductById(productId);
        CartItem cartItem = cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst().orElse(new CartItem());
        if (cartItem.getId() == null) {
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(quantity);
            cartItem.setUnitPrice(calculateDiscountedPrice(product));
        }
        else {
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
        }
        cartItem.setTotalPrice();
        cart.addItem(cartItem);
        cartItemRepository.save(cartItem);
        cartRepository.save(cart);
    }

    // Update the calculateDiscountedPrice method
    private BigDecimal calculateDiscountedPrice(Product product) {
        BigDecimal totalDiscountRate = product.getPromotions().stream()
                .map(promotion -> BigDecimal.valueOf(promotion.getDiscountRate()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal tmp = new BigDecimal(100);
        BigDecimal discountMultiplier = BigDecimal.ONE.subtract(totalDiscountRate.divide(tmp));
        System.out.println(discountMultiplier);
        return product.getPrice().multiply(discountMultiplier).setScale(2, RoundingMode.HALF_UP);
    }

    @Override
    public void removeItemFromCart(Long cartId, Long productId) {
        Cart cart = cartService.getCart(cartId);
        CartItem itemToRemove = getCartItem(cartId, productId);
        cart.removeItem(itemToRemove);
        cartRepository.save(cart);
    }

    @Override
    public void updateItemQuantity(Long cartId, Long productId, int quantity) {
        Cart cart = cartService.getCart(cartId);
        cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst()
                .ifPresent(item -> {
                    item.setQuantity(quantity);
                    item.setUnitPrice(calculateDiscountedPrice(item.getProduct()));
                    item.setTotalPrice();
                });
        BigDecimal totalAmount = cart.getItems()
                .stream().map(CartItem ::getTotalPrice)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        cart.setTotalAmount(totalAmount);
        cartRepository.save(cart);
    }

    @Override
    public CartItem getCartItem(Long cartId, Long productId) {
        Cart cart = cartService.getCart(cartId);
        return  cart.getItems()
                .stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .findFirst().orElseThrow(() -> new ResourceNotFoundException("Item not found"));
    }
}