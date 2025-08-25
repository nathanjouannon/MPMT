package com.mpmt.mpmt.dto;

import com.mpmt.mpmt.models.TaskStatus;

public class UpdateTaskStatusRequest {
    private Long taskId;
    private Long userRequestingId;
    private TaskStatus status;

    // Getters & Setters

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }

    public Long getUserRequestingId() {
        return userRequestingId;
    }

    public void setUserRequestingId(Long userRequestingId) {
        this.userRequestingId = userRequestingId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
