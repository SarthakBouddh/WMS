package com.wms.repository;

import com.wms.entity.Dispatch;
import com.wms.entity.DispatchStatus;
import com.wms.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DispatchRepository extends MongoRepository<Dispatch, String> {
    Optional<Dispatch> findByOrderId(String orderId);
    List<Dispatch> findByStatus(DispatchStatus status);
    List<Dispatch> findByDriver(User driver);
    List<Dispatch> findAllByOrderByDispatchedAtDesc();
}
