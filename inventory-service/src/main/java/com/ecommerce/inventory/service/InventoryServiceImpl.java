package com.ecommerce.inventory.service;

import com.ecommerce.inventory.entity.Inventory;
import com.ecommerce.inventory.exception.InsufficientStockException;
import com.ecommerce.inventory.repository.InventoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class InventoryServiceImpl implements InventoryService{

    private final InventoryRepository inventoryRepository;

    @Override
    public Inventory createInventory(Inventory inventory) {
        return inventoryRepository.save(inventory);
    }

    @Override
    public List<Inventory> getAllInventory() {
        return inventoryRepository.findAll();
    }

    @Override
    public Inventory getInventoryByProductId(Long productId) {

        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Inventory not found for product ID: " + productId
                        ));
    }

    @Override
    public Inventory updateInventory(Long productId, Inventory inventory) {

        Inventory existingInventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found for product ID: " + productId
                                ));

        existingInventory.setQuantity(inventory.getQuantity());

        return inventoryRepository.save(existingInventory);
    }

    @Override
    public Inventory reduceStock(Long productId, Integer quantity) {

        Inventory inventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found for product ID: "
                                                + productId
                                ));

        if (inventory.getQuantity() < quantity) {
            throw new InsufficientStockException(
                    "Insufficient stock for product ID: "
                            + productId
            );
        }

        inventory.setQuantity(
                inventory.getQuantity() - quantity
        );

        return inventoryRepository.save(inventory);
    }

    @Override
    public Inventory restoreStock(Long productId, Integer quantity) {

        Inventory inventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found for product ID: "
                                                + productId
                                ));

        inventory.setQuantity(
                inventory.getQuantity() + quantity
        );

        return inventoryRepository.save(inventory);
    }

    @Override
    public void deleteInventory(Long productId) {

        Inventory existingInventory =
                inventoryRepository.findByProductId(productId)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Inventory not found for product ID: " + productId
                                ));

        inventoryRepository.delete(existingInventory);
    }
}
