//package com.wms.config;
//
//import com.wms.entity.*;
//import com.wms.repository.*;
//import org.springframework.boot.CommandLineRunner;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Component;
//
//@Component
//public class DataInitializer implements CommandLineRunner {
//
//    private final ClientCompanyRepository clientCompanyRepository;
//    private final UserRepository userRepository;
//    private final ShopRepository shopRepository;
//    private final ProductRepository productRepository;
//    private final OrderRepository orderRepository;
//    private final DispatchRepository dispatchRepository;
//    private final PasswordEncoder passwordEncoder;
//
//    public DataInitializer(ClientCompanyRepository clientCompanyRepository,
//                           UserRepository userRepository,
//                           ShopRepository shopRepository,
//                           ProductRepository productRepository,
//                           OrderRepository orderRepository,
//                           DispatchRepository dispatchRepository,
//                           PasswordEncoder passwordEncoder) {
//        this.clientCompanyRepository = clientCompanyRepository;
//        this.userRepository = userRepository;
//        this.shopRepository = shopRepository;
//        this.productRepository = productRepository;
//        this.orderRepository = orderRepository;
//        this.dispatchRepository = dispatchRepository;
//        this.passwordEncoder = passwordEncoder;
//    }
//
//    @Override
//    public void run(String... args) {
//        // Ensure Super Admin account always exists
//        if (!userRepository.existsByUsername("SarthakBouddh")) {
//            User superAdmin = new User();
//            superAdmin.setUsername("SarthakBouddh");
//            superAdmin.setPassword(passwordEncoder.encode("123"));
//            superAdmin.setFullName("Sarthak Bouddh (Super Admin)");
//            superAdmin.setEmail("superadmin@wms.com");
//            superAdmin.setPhone("+919999900000");
//            superAdmin.setRole(Role.ROLE_SUPER_ADMIN);
//            superAdmin.setCompanyName("System SuperAdmin");
//            superAdmin.setTenantId("TENANT_SYSTEM_SUPERADMIN");
//            superAdmin.setActive(true);
//            userRepository.save(superAdmin);
//        }
//
//        // Only seed initial demo company and product records if database is empty
//        if (clientCompanyRepository.count() > 0) {
//            System.out.println(">>> MongoDB Atlas Cloud DB already contains " + clientCompanyRepository.count() + " client companies and " + userRepository.count() + " users. Skipping seed operation to preserve persistent data.");
//            return;
//        }
//
//        // 1. Create Initial Client Companies
//        ClientCompany sarthakDevCompany = new ClientCompany("SarthakDev", "sarthakdev", "contact@sarthakdev.com", "+919876543000");
//        sarthakDevCompany.setSubscriptionTier("ENTERPRISE");
//        sarthakDevCompany.setNotes("Primary flagship enterprise client account");
//        sarthakDevCompany = clientCompanyRepository.save(sarthakDevCompany);
//
//        ClientCompany jainElectronicsCompany = new ClientCompany("Jain Electronics", "jain_electronics", "support@jainelectronics.com", "+919811223344");
//        jainElectronicsCompany.setSubscriptionTier("PRO");
//        jainElectronicsCompany.setNotes("Leading retail consumer electronics distributor");
//        jainElectronicsCompany = clientCompanyRepository.save(jainElectronicsCompany);
//
//        String sarthakTenant = "TENANT_SARTHAKDEV";
//
//        // 2. Create Accounts for SarthakDev Company
//        User sarthakAdmin = new User("sarthak_admin", passwordEncoder.encode("sarthak123"), "Sarthak Bouddh", "sarthak@sarthakdev.com", "+919876543001", Role.ROLE_ADMIN, sarthakTenant);
//        sarthakAdmin.setCompanyId(sarthakDevCompany.getId());
//        sarthakAdmin.setCompanyName(sarthakDevCompany.getCompanyName());
//        userRepository.save(sarthakAdmin);
//
//        User siddharthMgr = new User("siddharth_mgr", passwordEncoder.encode("siddharth123"), "Siddharth Jain", "siddharth@sarthakdev.com", "+919876543002", Role.ROLE_MANAGER, sarthakTenant);
//        siddharthMgr.setCompanyId(sarthakDevCompany.getId());
//        siddharthMgr.setCompanyName(sarthakDevCompany.getCompanyName());
//        userRepository.save(siddharthMgr);
//
//        User rohanSales = new User("rohan_sales", passwordEncoder.encode("rohan123"), "Rohan Sharma", "rohan@sarthakdev.com", "+919876543003", Role.ROLE_SALES_REP, sarthakTenant);
//        rohanSales.setCompanyId(sarthakDevCompany.getId());
//        rohanSales.setCompanyName(sarthakDevCompany.getCompanyName());
//        userRepository.save(rohanSales);
//
//        User vikramDispatch = new User("vikram_dispatch", passwordEncoder.encode("vikram123"), "Vikram Singh", "vikram@sarthakdev.com", "+919876543004", Role.ROLE_DISPATCH_MANAGER, sarthakTenant);
//        vikramDispatch.setCompanyId(sarthakDevCompany.getId());
//        vikramDispatch.setCompanyName(sarthakDevCompany.getCompanyName());
//        userRepository.save(vikramDispatch);
//
//        // 3. Create Initial Admin for Jain Electronics Company
//        User jainAdmin = new User("jain_admin", passwordEncoder.encode("jain123"), "Sunil Jain", "admin@jainelectronics.com", "+919811223344", Role.ROLE_ADMIN, "TENANT_JAIN_ELECTRONICS");
//        jainAdmin.setCompanyId(jainElectronicsCompany.getId());
//        jainAdmin.setCompanyName(jainElectronicsCompany.getCompanyName());
//        userRepository.save(jainAdmin);
//
//        // 4. Create Retail Shops for SarthakDev
//        Shop apexShop = shopRepository.save(new Shop("SHP-101", "Apex Electronics & Mart", "Amit Shah", "+919810011223", "Connaught Place", "New Delhi", 14500.0, sarthakTenant));
//        Shop sarthakStore = shopRepository.save(new Shop("SHP-102", "Sarthak Superstore", "Sanjeev Verma", "+919810022334", "Indirapuram", "Ghaziabad", 8200.0, sarthakTenant));
//        Shop cyberShop = shopRepository.save(new Shop("SHP-103", "CyberCity Provisions", "Rahul Gupta", "+919810033445", "DLF CyberCity", "Gurugram", 24900.0, sarthakTenant));
//        Shop modernMart = shopRepository.save(new Shop("SHP-104", "Modern Mart", "Neha Jain", "+919810044556", "Sector 18", "Noida", 6750.0, sarthakTenant));
//        Shop metroHyper = shopRepository.save(new Shop("SHP-105", "Metro Hypermarket", "Suresh Kumar", "+919810055667", "Rajouri Garden", "New Delhi", 18300.0, sarthakTenant));
//        Shop royalTraders = shopRepository.save(new Shop("SHP-106", "Royal Traders", "Manish Agrawal", "+919810066778", "Chandni Chowk", "Delhi", 11400.0, sarthakTenant));
//
//        // 5. Create Products for SarthakDev Catalog
//        Product ledDisplay = productRepository.save(new Product("SD-PROD-01", "Sarthak Smart LED Display 55\"", "Electronics", 42500.0, 85, 15, sarthakTenant));
//        Product router = productRepository.save(new Product("SD-PROD-02", "High-Speed Wireless Router", "Networking", 3499.0, 12, 20, sarthakTenant));
//        Product officeChair = productRepository.save(new Product("SD-PROD-03", "Ergonomic Mesh Office Chair", "Furniture", 8990.0, 45, 10, sarthakTenant));
//        Product surgeProtector = productRepository.save(new Product("SD-PROD-04", "Smart Power Surge Protector", "Accessories", 1299.0, 9, 25, sarthakTenant));
//        Product securityCam = productRepository.save(new Product("SD-PROD-05", "HD Surveillance Camera 4K", "Security", 5750.0, 150, 30, sarthakTenant));
//
//        // 6. Create Sales Orders for SarthakDev
//        Order o1 = new Order("ORD-SD-901", apexShop, rohanSales, 85000.0, 2, OrderStatus.PENDING);
//        o1.addItem(new OrderItem(ledDisplay, 2, 42500.0));
//        orderRepository.save(o1);
//
//        Order o2 = new Order("ORD-SD-902", sarthakStore, rohanSales, 26970.0, 3, OrderStatus.PENDING);
//        o2.addItem(new OrderItem(officeChair, 3, 8990.0));
//        orderRepository.save(o2);
//
//        Order o3 = new Order("ORD-SD-903", cyberShop, rohanSales, 53940.0, 6, OrderStatus.PENDING);
//        o3.addItem(new OrderItem(officeChair, 6, 8990.0));
//        orderRepository.save(o3);
//
//        Order o4 = new Order("ORD-SD-904", modernMart, rohanSales, 12990.0, 10, OrderStatus.DELIVERED);
//        o4.addItem(new OrderItem(surgeProtector, 10, 1299.0));
//        orderRepository.save(o4);
//
//        Order o5 = new Order("ORD-SD-905", metroHyper, rohanSales, 44950.0, 5, OrderStatus.PENDING);
//        o5.addItem(new OrderItem(officeChair, 5, 8990.0));
//        orderRepository.save(o5);
//
//        // 7. Create Dispatch Entry for SarthakDev
//        Dispatch dispatch1 = new Dispatch("DSP-SD-501", o4, "DL01AB9988", "SARTHAK_DEV_LOGISTICS", vikramDispatch, DispatchStatus.DELIVERED);
//        dispatch1.setNotes("Delivered securely to Modern Mart Noida");
//        dispatchRepository.save(dispatch1);
//
//        System.out.println(">>> SUCCESS: Initialized MongoDB Cloud Database with " + clientCompanyRepository.count() + " client companies and " + userRepository.count() + " users <<<");
//    }
//}
