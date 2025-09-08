package com.mpmt.mpmt.dto;

import com.mpmt.mpmt.models.TaskPriority;
import com.mpmt.mpmt.models.TaskStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class TaskUpdateRequest {
    private String title;
    private String description;
    private TaskPriority priority;
    private TaskStatus status;
    private LocalDate dueDate;

    private Long userRequestingId; // celui qui fait la requête

    // getters et setters

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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public Long getUserRequestingId() {
        return userRequestingId;
    }

    public void setUserRequestingId(Long userRequestingId) {
        this.userRequestingId = userRequestingId;
    }
}
