package com.wms.dto;

import com.wms.entity.Role;

public class AuthResponse {
    private String token;
    private String tokenType = "Bearer";
    private String username;
    private String fullName;
    private Role role;
    private String companyName;
    private String companyId;

    public AuthResponse(String token, String username, String fullName, Role role, String companyName, String companyId) {
        this.token = token;
        this.username = username;
        this.fullName = fullName;
        this.role = role;
        this.companyName = companyName;
        this.companyId = companyId;
    }

    public AuthResponse(String token, String username, String fullName, Role role) {
        this(token, username, fullName, role, null, null);
    }

    public String getToken() { return token; }
    public String getTokenType() { return tokenType; }
    public String getUsername() { return username; }
    public String getFullName() { return fullName; }
    public Role getRole() { return role; }
    public String getCompanyName() { return companyName; }
    public String getCompanyId() { return companyId; }
}
