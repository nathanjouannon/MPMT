package com.mpmt.mpmt.service;

import com.mpmt.mpmt.dto.LoginRequest;
import com.mpmt.mpmt.dto.LoginResponse;
import com.mpmt.mpmt.dto.RegisterRequest;
import com.mpmt.mpmt.models.User;

public interface AuthService {
    // Create a new account
    User register(RegisterRequest request);

    // Login
    LoginResponse login(LoginRequest request);
}
