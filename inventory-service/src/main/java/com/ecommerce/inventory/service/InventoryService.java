package com.ecommerce.inventory.service;

import com.ecommerce.inventory.entity.Inventory;

import java.util.List;

public interface InventoryService {

    Inventory createInventory(Inventory inventory);

    List<Inventory> getAllInventory();

    Inventory getInventoryByProductId(Long productId);

    Inventory updateInventory(Long productId, Inventory inventory);

    Inventory reduceStock(Long productId, Integer quantity);

    Inventory restoreStock(Long productId, Integer quantity);

    void deleteInventory(Long productId);
}
