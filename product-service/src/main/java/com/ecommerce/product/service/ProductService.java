package com.ecommerce.product.service;
import com.ecommerce.product.entity.Product;

import java.util.List;
public interface ProductService {

    Product createProduct(Product product);

    List<Product> getAllProducts();

    Product getProductById(Long id);

    Product updateProduct(Long id, Product product);

    void deleteProduct(Long id);
}
