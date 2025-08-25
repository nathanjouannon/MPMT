package com.mpmt.mpmt.dao;

import com.mpmt.mpmt.models.Notification;
import com.mpmt.mpmt.models.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface NotificationRepository extends CrudRepository<Notification, Long> {
    List<Notification> findByUserOrderBySentAtDesc(User user);
}
