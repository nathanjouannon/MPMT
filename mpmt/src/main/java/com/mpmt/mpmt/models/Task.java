package com.mpmt.mpmt.models;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "due_date")
    private LocalDate dueDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    @Column(length = 10)
    private String priority = "MEDIUM";

    @Column(length = 20)
    private String status = "TODO";

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relations
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @OneToMany(mappedBy = "task")
    private List<TaskAssignment> assignments;

    @OneToMany(mappedBy = "task")
    private List<TaskHistory> history;
}
