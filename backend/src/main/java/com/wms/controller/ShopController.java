package com.wms.controller;

import com.wms.entity.Shop;
import com.wms.repository.ShopRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/shops")
public class ShopController {

    private final ShopRepository shopRepository;

    public ShopController(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    @GetMapping
    public ResponseEntity<List<Shop>> getAllShops() {
        return ResponseEntity.ok(shopRepository.findAll());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<Shop> createShop(@RequestBody Shop shop) {
        if (shop.getShopCode() == null || shop.getShopCode().isEmpty()) {
            shop.setShopCode("SHP-" + (shopRepository.count() + 101));
        }
        return ResponseEntity.ok(shopRepository.save(shop));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteShop(@PathVariable String id) {
        if (!shopRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        shopRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
