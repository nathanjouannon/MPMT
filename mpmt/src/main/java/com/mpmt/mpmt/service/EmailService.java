package com.mpmt.mpmt.service;

public interface EmailService {
    void sendEmail(String to, String subject, String body);
}
