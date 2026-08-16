package com.wms.repository;

import com.wms.entity.Role;
import com.wms.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
    List<User> findByRole(Role role);
    List<User> findByCompanyId(String companyId);
    List<User> findByTenantId(String tenantId);
    long countByCompanyId(String companyId);
}
