package com.mpmt.mpmt.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notifications")
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 30, nullable = false)
    private String type;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String message;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    @Column(name = "is_read")
    private boolean isRead = false;

    // Relation
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
