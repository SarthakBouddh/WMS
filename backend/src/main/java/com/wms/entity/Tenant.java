package com.wms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "tenants")
public class Tenant {

    @Id
    private String tenantId; // e.g. "TENANT_METRO_LOGISTICS", "TENANT_APEX_RETAIL"

    private String companyName;
    private String contactEmail;
    private String currency = "₹";
    private String status = "ACTIVE";

    public Tenant() {}

    public Tenant(String tenantId, String companyName, String contactEmail, String currency, String status) {
        this.tenantId = tenantId;
        this.companyName = companyName;
        this.contactEmail = contactEmail;
        this.currency = currency;
        this.status = status;
    }

    public String getTenantId() { return tenantId; }
    public void setTenantId(String tenantId) { this.tenantId = tenantId; }

    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }

    public String getContactEmail() { return contactEmail; }
    public void setContactEmail(String contactEmail) { this.contactEmail = contactEmail; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
