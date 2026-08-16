package com.wms.controller;

import com.wms.entity.OrderStatus;
import com.wms.repository.DispatchRepository;
import com.wms.repository.OrderRepository;
import com.wms.repository.ProductRepository;
import com.wms.repository.ShopRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/reports")
public class ReportController {

    private final OrderRepository orderRepository;
    private final DispatchRepository dispatchRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;

    public ReportController(OrderRepository orderRepository,
                            DispatchRepository dispatchRepository,
                            ShopRepository shopRepository,
                            ProductRepository productRepository) {
        this.orderRepository = orderRepository;
        this.dispatchRepository = dispatchRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary() {
        long totalOrders = orderRepository.count();
        long pendingOrders = orderRepository.findByStatus(OrderStatus.PENDING).size();
        long dispatchedOrders = orderRepository.findByStatus(OrderStatus.DISPATCHED).size();
        long inTransitOrders = orderRepository.findByStatus(OrderStatus.IN_TRANSIT).size();
        long deliveredOrders = orderRepository.findByStatus(OrderStatus.DELIVERED).size();
        long totalShops = shopRepository.count();
        long totalProducts = productRepository.count();
        long loggedDispatches = dispatchRepository.count();

        double totalRevenue = orderRepository.findAll().stream()
                .mapToDouble(o -> o.getTotalAmount() != null ? o.getTotalAmount() : 0.0)
                .sum();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalOrders", totalOrders);
        summary.put("pendingOrders", pendingOrders);
        summary.put("dispatchedOrders", dispatchedOrders);
        summary.put("inTransitOrders", inTransitOrders);
        summary.put("deliveredOrders", deliveredOrders);
        summary.put("totalShops", totalShops);
        summary.put("totalProducts", totalProducts);
        summary.put("loggedDispatches", loggedDispatches);
        summary.put("totalRevenue", totalRevenue);

        return ResponseEntity.ok(summary);
    }
}
