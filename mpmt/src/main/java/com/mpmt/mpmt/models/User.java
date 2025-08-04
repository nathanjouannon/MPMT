package com.mpmt.mpmt.models;

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
    private String password;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Relations
    @OneToMany(mappedBy = "owner")
    private List<Project> ownedProjects;

    @OneToMany(mappedBy = "user")
    private List<ProjectMember> memberships;

    @OneToMany(mappedBy = "user")
    private List<TaskAssignment> assignedTasks;

    @OneToMany(mappedBy = "user")
    private List<TaskHistory> taskHistories;

    @OneToMany(mappedBy = "user")
    private List<Notification> notifications;

    @OneToMany(mappedBy = "invitedBy")
    private List<Invitation> sentInvitations;
}
