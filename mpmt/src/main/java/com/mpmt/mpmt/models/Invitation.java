package com.mpmt.mpmt.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "invitations")
public class Invitation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String email;

    @Column(length = 255, nullable = false)
    private String token;

    @Column(length = 20)
    private String status = "PENDING";

    @Column(name = "sent_at")
    private LocalDateTime sentAt;

    // Relations
    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "invited_by", nullable = false)
    private User invitedBy;
}
