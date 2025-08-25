package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.NotificationRepository;
import com.mpmt.mpmt.models.Notification;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Override
    public Notification createNotification(User user, String type, String message) {
        Notification notif = new Notification();
        notif.setUser(user);
        notif.setType(type);
        notif.setMessage(message);
        notif.setSentAt(LocalDateTime.now());
        notif.setRead(false);
        return notificationRepository.save(notif);
    }

    @Override
    public List<Notification> getUserNotifications(User user) {
        return notificationRepository.findByUserOrderBySentAtDesc(user);
    }

    @Override
    public void markAsRead(Long notificationId) {
        Notification notif = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification non trouvée"));
        notif.setRead(true);
        notificationRepository.save(notif);
    }
}
