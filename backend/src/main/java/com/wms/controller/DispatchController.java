package com.wms.controller;

import com.wms.dto.DispatchOrderRequest;
import com.wms.dto.UpdateDispatchStatusRequest;
import com.wms.entity.*;
import com.wms.repository.DispatchRepository;
import com.wms.repository.OrderRepository;
import com.wms.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/dispatches")
public class DispatchController {

    private final DispatchRepository dispatchRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DispatchController(DispatchRepository dispatchRepository,
                               OrderRepository orderRepository,
                               UserRepository userRepository) {
        this.dispatchRepository = dispatchRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Dispatch>> getAllDispatches(Authentication authentication) {
        User currentUser = userRepository.findByUsername(authentication.getName()).orElseThrow();
        
        if (currentUser.getRole() == Role.ROLE_DRIVER) {
            return ResponseEntity.ok(dispatchRepository.findByDriver(currentUser));
        }
        return ResponseEntity.ok(dispatchRepository.findAllByOrderByDispatchedAtDesc());
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DISPATCH_MANAGER')")
    public ResponseEntity<?> createDispatch(@RequestBody DispatchOrderRequest request) {
        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + request.getOrderId()));

        if (dispatchRepository.findByOrderId(order.getId()).isPresent()) {
            return ResponseEntity.badRequest().body("Order is already dispatched!");
        }

        User driver = null;
        if (request.getDriverId() != null) {
            driver = userRepository.findById(request.getDriverId()).orElse(null);
        }

        String dispatchNum = "DSP-SD-" + System.currentTimeMillis() % 1000000 + "-" + UUID.randomUUID().toString().substring(0, 5).toUpperCase();
        
        Dispatch dispatch = new Dispatch(
                dispatchNum,
                order,
                request.getVehicleNumber() != null ? request.getVehicleNumber() : "DL01AB9988",
                request.getTransportProvider() != null ? request.getTransportProvider() : "SARTHAK_DEV_LOGISTICS",
                driver,
                DispatchStatus.DISPATCHED
        );

        // Update Order status
        order.setStatus(OrderStatus.DISPATCHED);
        orderRepository.save(order);

        Dispatch savedDispatch = dispatchRepository.save(dispatch);
        return ResponseEntity.ok(savedDispatch);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER', 'DISPATCH_MANAGER', 'DRIVER')")
    public ResponseEntity<?> updateDispatchStatus(@PathVariable String id, @RequestBody UpdateDispatchStatusRequest request) {
        Dispatch dispatch = dispatchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Dispatch record not found: " + id));

        dispatch.setStatus(request.getStatus());
        if (request.getNotes() != null) {
            dispatch.setNotes(request.getNotes());
        }

        Order order = dispatch.getOrder();
        if (request.getStatus() == DispatchStatus.IN_TRANSIT) {
            order.setStatus(OrderStatus.IN_TRANSIT);
        } else if (request.getStatus() == DispatchStatus.DELIVERED) {
            order.setStatus(OrderStatus.DELIVERED);
            dispatch.setDeliveredAt(LocalDateTime.now());
        }

        orderRepository.save(order);
        Dispatch updated = dispatchRepository.save(dispatch);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteDispatch(@PathVariable String id) {
        if (!dispatchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        dispatchRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
