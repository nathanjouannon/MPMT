package com.mpmt.mpmt.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "username", nullable = false, unique = true, length = 50)
    private String username;

    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    @Column(name = "password", nullable = false, length = 255)
    @JsonIgnore
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Relations
    @OneToMany(mappedBy = "owner")
    @JsonIgnore
    private List<Project> ownedProjects;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<ProjectMember> memberships;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<TaskAssignment> assignedTasks;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<TaskHistory> taskHistories;

    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private List<Notification> notifications;

    @OneToMany(mappedBy = "invitedBy")
    @JsonIgnore
    private List<Invitation> sentInvitations;

    // getter and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<Project> getOwnedProjects() {
        return ownedProjects;
    }

    public void setOwnedProjects(List<Project> ownedProjects) {
        this.ownedProjects = ownedProjects;
    }

    public List<ProjectMember> getMemberships() {
        return memberships;
    }

    public void setMemberships(List<ProjectMember> memberships) {
        this.memberships = memberships;
    }

    public List<TaskAssignment> getAssignedTasks() {
        return assignedTasks;
    }

    public void setAssignedTasks(List<TaskAssignment> assignedTasks) {
        this.assignedTasks = assignedTasks;
    }

    public List<TaskHistory> getTaskHistories() {
        return taskHistories;
    }

    public void setTaskHistories(List<TaskHistory> taskHistories) {
        this.taskHistories = taskHistories;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Invitation> getSentInvitations() {
        return sentInvitations;
    }

    public void setSentInvitations(List<Invitation> sentInvitations) {
        this.sentInvitations = sentInvitations;
    }
}
