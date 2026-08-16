package com.wms.repository;

import com.wms.entity.ClientCompany;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ClientCompanyRepository extends MongoRepository<ClientCompany, String> {
    Optional<ClientCompany> findByCompanyName(String companyName);
    Optional<ClientCompany> findByCode(String code);
    boolean existsByCompanyName(String companyName);
}
