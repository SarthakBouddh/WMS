package com.wms.controller;

import com.wms.entity.ClientCompany;
import com.wms.entity.Role;
import com.wms.entity.User;
import com.wms.repository.ClientCompanyRepository;
import com.wms.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/superadmin")
@PreAuthorize("hasRole('SUPER_ADMIN')")
public class SuperAdminController {

    private final ClientCompanyRepository clientCompanyRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminController(ClientCompanyRepository clientCompanyRepository,
                                UserRepository userRepository,
                                PasswordEncoder passwordEncoder) {
        this.clientCompanyRepository = clientCompanyRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // 1. Get Platform Stats
    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        long totalClients = clientCompanyRepository.count();
        long activeClients = clientCompanyRepository.findAll().stream()
                .filter(c -> "ACTIVE".equalsIgnoreCase(c.getStatus())).count();
        long suspendedClients = totalClients - activeClients;
        long totalUsers = userRepository.count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalClients", totalClients);
        stats.put("activeClients", activeClients);
        stats.put("suspendedClients", suspendedClients);
        stats.put("totalUsers", totalUsers);

        return ResponseEntity.ok(stats);
    }

    // 2. List All Client Companies
    @GetMapping("/clients")
    public ResponseEntity<List<ClientCompany>> getAllClients() {
        List<ClientCompany> clients = clientCompanyRepository.findAll();
        return ResponseEntity.ok(clients);
    }

    // 3. Create New Client Company
    @PostMapping("/clients")
    public ResponseEntity<?> createClientCompany(@RequestBody Map<String, Object> payload) {
        String companyName = (String) payload.get("companyName");
        String code = (String) payload.get("code");
        String contactEmail = (String) payload.get("contactEmail");
        String contactPhone = (String) payload.get("contactPhone");

        if (companyName == null || companyName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Company name is required"));
        }

        if (clientCompanyRepository.existsByCompanyName(companyName)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Client company name already exists"));
        }

        if (code == null || code.trim().isEmpty()) {
            code = companyName.toLowerCase().replaceAll("[^a-z0-9]", "_");
        }

        ClientCompany client = new ClientCompany(companyName, code, contactEmail, contactPhone);
        if (payload.get("subscriptionTier") != null) {
            client.setSubscriptionTier((String) payload.get("subscriptionTier"));
        }
        if (payload.get("notes") != null) {
            client.setNotes((String) payload.get("notes"));
        }

        ClientCompany saved = clientCompanyRepository.save(client);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 4. Update Client Company Status
    @PutMapping("/clients/{id}/status")
    public ResponseEntity<?> updateClientStatus(@PathVariable String id, @RequestBody Map<String, String> payload) {
        Optional<ClientCompany> clientOpt = clientCompanyRepository.findById(id);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ClientCompany client = clientOpt.get();
        String status = payload.get("status");
        if (status != null) {
            client.setStatus(status.toUpperCase());
            clientCompanyRepository.save(client);
        }
        return ResponseEntity.ok(client);
    }

    // 5. Get Users (All or Filtered by companyId)
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers(@RequestParam(required = false) String companyId) {
        if (companyId != null && !companyId.trim().isEmpty()) {
            return ResponseEntity.ok(userRepository.findByCompanyId(companyId));
        }
        return ResponseEntity.ok(userRepository.findAll());
    }

    // 6. Create User for a Specific Client Company
    @PostMapping("/users")
    public ResponseEntity<?> createClientUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String rawPassword = payload.get("password");
        String fullName = payload.get("fullName");
        String email = payload.get("email");
        String phone = payload.get("phone");
        String roleStr = payload.get("role");
        String companyId = payload.get("companyId");

        if (username == null || rawPassword == null || companyId == null || roleStr == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username, password, companyId, and role are required"));
        }

        if (userRepository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Username is already taken"));
        }

        Optional<ClientCompany> companyOpt = clientCompanyRepository.findById(companyId);
        if (companyOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid Client Company ID"));
        }

        ClientCompany company = companyOpt.get();
        Role role;
        try {
            role = Role.valueOf(roleStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Invalid role specified"));
        }

        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setFullName(fullName != null ? fullName : username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setRole(role);
        user.setCompanyId(company.getId());
        user.setCompanyName(company.getCompanyName());
        user.setTenantId("TENANT_" + company.getCode().toUpperCase());
        user.setActive(true);

        User saved = userRepository.save(user);

        // Do not return password hash
        saved.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    // 7. Toggle User Active Status
    @PutMapping("/users/{id}/status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable String id, @RequestBody Map<String, Boolean> payload) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = userOpt.get();
        Boolean active = payload.get("active");
        if (active != null) {
            user.setActive(active);
            userRepository.save(user);
        }
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }
}
