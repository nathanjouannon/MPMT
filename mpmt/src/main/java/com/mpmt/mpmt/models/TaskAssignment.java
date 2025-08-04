package com.mpmt.mpmt.models;

import jakarta.persistence.*;

@Entity
@Table(name = "task_assignments")
public class TaskAssignment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relation
    @ManyToOne
    @JoinColumn(name = "task_id", nullable = false)
    private Task task;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

}
