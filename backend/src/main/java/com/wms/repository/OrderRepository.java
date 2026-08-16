package com.wms.repository;

import com.wms.entity.Order;
import com.wms.entity.OrderStatus;
import com.wms.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, String> {
    List<Order> findByStatus(OrderStatus status);
    List<Order> findByCreatedBy(User user);
    List<Order> findByShopId(String shopId);
    List<Order> findAllByOrderByCreatedAtDesc();
}
