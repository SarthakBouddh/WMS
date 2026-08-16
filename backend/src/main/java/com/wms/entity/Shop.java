package com.wms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "shops")
public class Shop {

    @Id
    private String id;

    private String tenantId = "TENANT_SARTHAKDEV";

    @Indexed(unique = true)
    private String shopCode;

    private String name;
    private String ownerName;
    private String phone;
    private String address;
    private String city;
    private Double dueAmount;

    public Shop() {}

    public Shop(String shopCode, String name, String ownerName, String phone, String address, String city, String tenantId) {
        this.shopCode = shopCode;
        this.name = name;
        this.ownerName = ownerName;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.tenantId = tenantId != null ? tenantId : "TENANT_SARTHAKDEV";
    }

    public Shop(String shopCode, String name, String ownerName, String phone, String address, String city, Double dueAmount, String tenantId) {
        this.shopCode = shopCode;
        this.name = name;
        this.ownerName = ownerName;
        this.phone = phone;
        this.address = address;
        this.city = city;
        this.dueAmount = dueAmount;
        this.tenantId = tenantId != null ? tenantId : "TENANT_SARTHAKDEV";
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getShopCode() { return shopCode; }
    public void setShopCode(String shopCode) { this.shopCode = shopCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getDueAmount() { return dueAmount; }
    public void setDueAmount(Double dueAmount) { this.dueAmount = dueAmount; }
}
