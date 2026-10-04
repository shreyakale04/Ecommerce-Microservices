package com.ecommerce.inventory.controller;

import com.ecommerce.inventory.entity.Inventory;
import com.ecommerce.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping
    public ResponseEntity<Inventory> createInventory(
            @RequestBody Inventory inventory) {

        Inventory savedInventory =
                inventoryService.createInventory(inventory);

        return new ResponseEntity<>(
                savedInventory,
                HttpStatus.CREATED
        );
    }
    @GetMapping
    public ResponseEntity<List<Inventory>> getAllInventory() {

        List<Inventory> inventoryList =
                inventoryService.getAllInventory();

        return ResponseEntity.ok(inventoryList);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<Inventory> getInventoryByProductId(
            @PathVariable Long productId) {

        Inventory inventory =
                inventoryService.getInventoryByProductId(productId);

        return ResponseEntity.ok(inventory);
    }
    @PutMapping("/product/{productId}")
    public ResponseEntity<Inventory> updateInventory(
            @PathVariable Long productId,
            @RequestBody Inventory inventory) {

        Inventory updatedInventory =
                inventoryService.updateInventory(
                        productId,
                        inventory
                );

        return ResponseEntity.ok(updatedInventory);
    }
    @PutMapping("/product/{productId}/reduce")
    public ResponseEntity<Inventory> reduceStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        Inventory inventory =
                inventoryService.reduceStock(productId, quantity);

        return ResponseEntity.ok(inventory);
    }

    @PutMapping("/product/{productId}/restore")
    public ResponseEntity<Inventory> restoreStock(
            @PathVariable Long productId,
            @RequestParam Integer quantity) {

        Inventory inventory =
                inventoryService.restoreStock(
                        productId,
                        quantity
                );

        return ResponseEntity.ok(inventory);
    }

    @DeleteMapping("/product/{productId}")
    public ResponseEntity<Void> deleteInventory(
            @PathVariable Long productId) {

        inventoryService.deleteInventory(productId);

        return ResponseEntity.noContent().build();
    }
}
