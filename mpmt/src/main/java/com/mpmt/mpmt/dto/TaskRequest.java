package com.mpmt.mpmt.dto;

import com.mpmt.mpmt.models.TaskPriority;
import com.mpmt.mpmt.models.TaskStatus;

import java.time.LocalDate;

public class TaskRequest {
    private Long projectId;
    private Long userRequestingId;
    private String title;
    private String description;
    private LocalDate dueDate;
    private LocalDate endDate;
    private TaskPriority priority; // enum
    private TaskStatus status; // enum

    // Getters & Setters ...

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public Long getUserRequestingId() {
        return userRequestingId;
    }

    public void setUserRequestingId(Long userRequestingId) {
        this.userRequestingId = userRequestingId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
