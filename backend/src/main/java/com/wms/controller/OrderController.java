package com.wms.controller;

import com.wms.dto.CreateOrderRequest;
import com.wms.entity.*;
import com.wms.repository.OrderRepository;
import com.wms.repository.ProductRepository;
import com.wms.repository.ShopRepository;
import com.wms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/orders")
public class OrderController {

    private final OrderRepository orderRepository;
    private final ShopRepository shopRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public OrderController(OrderRepository orderRepository,
                           ShopRepository shopRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.shopRepository = shopRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Order>> getAllOrders(
            @RequestParam(required = false) OrderStatus status,
            Authentication authentication) {
        
        User currentUser = userRepository.findByUsername(authentication.getName()).orElseThrow();
        List<Order> orders;

        if (currentUser.getRole() == Role.ROLE_SALES_REP) {
            orders = orderRepository.findByCreatedBy(currentUser);
        } else if (status != null) {
            orders = orderRepository.findByStatus(status);
        } else {
            orders = orderRepository.findAllByOrderByCreatedAtDesc();
        }

        return ResponseEntity.ok(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable String id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'SALES_REP')")
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request, Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElseThrow();
        Shop shop = shopRepository.findById(request.getShopId())
                .orElseThrow(() -> new RuntimeException("Shop not found with ID: " + request.getShopId()));

        String orderNumber = "ORD-SD-" + System.currentTimeMillis() % 1000000 + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        
        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setShop(shop);
        order.setCreatedBy(currentUser);
        order.setStatus(OrderStatus.PENDING);

        double subtotal = 0.0;
        int totalItems = 0;

        for (CreateOrderRequest.OrderItemDto itemDto : request.getItems()) {
            Product product = productRepository.findById(itemDto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found ID: " + itemDto.getProductId()));
            
            OrderItem item = new OrderItem(product, itemDto.getQuantity(), product.getPrice());
            order.addItem(item);

            subtotal += item.getTotalPrice();
            totalItems += itemDto.getQuantity();
        }

        double discount = request.getDiscount() != null ? Math.max(0.0, request.getDiscount()) : 0.0;
        double netTotal = Math.max(0.0, subtotal - discount);

        order.setDiscount(discount);
        order.setTotalAmount(netTotal);
        order.setTotalItems(totalItems);

        Order savedOrder = orderRepository.save(order);
        return ResponseEntity.ok(savedOrder);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DISPATCH_MANAGER')")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id, @RequestBody Map<String, String> body) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        
        if (body.containsKey("status")) {
            order.setStatus(OrderStatus.valueOf(body.get("status")));
            orderRepository.save(order);
        }
        return ResponseEntity.ok(order);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteOrder(@PathVariable String id) {
        if (!orderRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        orderRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
