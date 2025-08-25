package com.mpmt.mpmt.dto;

public class TaskAssignmentRequest {
    private Long taskId;
    private Long userRequestingId;
    private String userEmailToAssign;

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

    public String getUserEmailToAssign() {
        return userEmailToAssign;
    }

    public void setUserEmailToAssign(String userEmailToAssign) {
        this.userEmailToAssign = userEmailToAssign;
    }
}
