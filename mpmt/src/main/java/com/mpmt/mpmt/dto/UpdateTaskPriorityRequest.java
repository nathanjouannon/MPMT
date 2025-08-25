package com.mpmt.mpmt.dto;

import com.mpmt.mpmt.models.TaskPriority;

public class UpdateTaskPriorityRequest {
    private Long taskId;
    private Long userRequestingId;
    private TaskPriority priority;

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

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }
}
