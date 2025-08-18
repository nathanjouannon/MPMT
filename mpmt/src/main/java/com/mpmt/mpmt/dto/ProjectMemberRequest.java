package com.mpmt.mpmt.dto;

import com.mpmt.mpmt.models.ProjectMemberRole;

public class ProjectMemberRequest {
    private Long userRequestingID;
    private String userEmail;
    private Long projectId;
    private ProjectMemberRole role;

    public Long getUserRequestingID() {
        return userRequestingID;
    }

    public void setUserRequestingID(Long userRequestingID) {
        this.userRequestingID = userRequestingID;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public ProjectMemberRole getRole() {
        return role;
    }

    public void setRole(ProjectMemberRole role) {
        this.role = role;
    }
}
