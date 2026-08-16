package com.wms.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "dispatches")
public class Dispatch {

    @Id
    private String id;

    private String dispatchNumber;

    @DBRef
    private Order order;

    private String vehicleNumber; // e.g. DL01AB9988
    private String transportProvider; // e.g. SARTHAK_DEV_LOGISTICS

    @DBRef
    private User driver;

    private DispatchStatus status = DispatchStatus.DISPATCHED;
    private LocalDateTime dispatchedAt = LocalDateTime.now();
    private LocalDateTime deliveredAt;
    private String notes;

    public Dispatch() {}

    public Dispatch(String dispatchNumber, Order order, String vehicleNumber, String transportProvider, User driver, DispatchStatus status) {
        this.dispatchNumber = dispatchNumber;
        this.order = order;
        this.vehicleNumber = vehicleNumber;
        this.transportProvider = transportProvider;
        this.driver = driver;
        this.status = status;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getDispatchNumber() { return dispatchNumber; }
    public void setDispatchNumber(String dispatchNumber) { this.dispatchNumber = dispatchNumber; }

    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getTransportProvider() { return transportProvider; }
    public void setTransportProvider(String transportProvider) { this.transportProvider = transportProvider; }

    public User getDriver() { return driver; }
    public void setDriver(User driver) { this.driver = driver; }

    public DispatchStatus getStatus() { return status; }
    public void setStatus(DispatchStatus status) { this.status = status; }

    public LocalDateTime getDispatchedAt() { return dispatchedAt; }
    public void setDispatchedAt(LocalDateTime dispatchedAt) { this.dispatchedAt = dispatchedAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
