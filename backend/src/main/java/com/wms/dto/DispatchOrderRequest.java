package com.wms.dto;

public class DispatchOrderRequest {
    private String orderId;
    private String vehicleNumber;
    private String transportProvider;
    private String driverId;

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getVehicleNumber() { return vehicleNumber; }
    public void setVehicleNumber(String vehicleNumber) { this.vehicleNumber = vehicleNumber; }

    public String getTransportProvider() { return transportProvider; }
    public void setTransportProvider(String transportProvider) { this.transportProvider = transportProvider; }

    public String getDriverId() { return driverId; }
    public void setDriverId(String driverId) { this.driverId = driverId; }
}
