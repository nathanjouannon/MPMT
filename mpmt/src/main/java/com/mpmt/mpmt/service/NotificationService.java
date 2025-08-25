package com.mpmt.mpmt.service;

import com.mpmt.mpmt.models.Notification;
import com.mpmt.mpmt.models.User;

import java.util.List;

public interface NotificationService {
    Notification createNotification(User user, String type, String message);
    List<Notification> getUserNotifications(User user);
    void markAsRead(Long notificationId);
}
