package com.mpmt.mpmt.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @Column(name = "description", nullable = true, columnDefinition = "TEXT")
    private String description;

    @Column(name = "start_date", nullable = false)
    private LocalDateTime startDate;

    // Relations
    @ManyToOne
    @JoinColumn(name = "owner_id", nullable = false)
    private User owner;

    @OneToMany(mappedBy = "project")
    private List<ProjectMember> members;

    @OneToMany(mappedBy = "project")
    private List<Task> tasks;

    @OneToMany(mappedBy = "project")
    private List<Invitation> invitations;

}
