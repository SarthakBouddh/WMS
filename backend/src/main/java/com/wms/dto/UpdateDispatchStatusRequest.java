package com.wms.dto;

import com.wms.entity.DispatchStatus;

public class UpdateDispatchStatusRequest {
    private DispatchStatus status;
    private String notes;

    public DispatchStatus getStatus() { return status; }
    public void setStatus(DispatchStatus status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
