package com.ecommerce.order.client;

import com.ecommerce.order.config.FeignConfig;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(
        name = "inventory-service",
        configuration = FeignConfig.class
)
public interface InventoryClient {

    @GetMapping("/inventory/product/{productId}")
    InventoryResponse getInventoryByProductId(
            @PathVariable("productId") Long productId
    );

    @PutMapping("/inventory/product/{productId}/reduce")
    InventoryResponse reduceStock(
            @PathVariable("productId") Long productId,
            @RequestParam("quantity") Integer quantity
    );

    @PutMapping("/inventory/product/{productId}/restore")
    InventoryResponse restoreStock(
            @PathVariable("productId") Long productId,
            @RequestParam("quantity") Integer quantity
    );
}
