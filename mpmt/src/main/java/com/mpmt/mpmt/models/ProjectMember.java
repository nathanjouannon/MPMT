package com.mpmt.mpmt.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "project_members")
public class ProjectMember {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 20)
    private String role;

    @Column(name = "joined_at")
    private LocalDateTime joinedAt;

    // Relations
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;
}
