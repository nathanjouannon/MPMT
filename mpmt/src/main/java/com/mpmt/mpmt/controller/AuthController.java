package com.mpmt.mpmt.controller;

import com.mpmt.mpmt.dto.LoginRequest;
import com.mpmt.mpmt.dto.LoginResponse;
import com.mpmt.mpmt.dto.RegisterRequest;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public User register(@RequestBody RegisterRequest request) {
        return authService.register(request);
    }

    @PostMapping("/login")
    public LoginResponse login(@RequestBody LoginRequest request) {
        return authService.login(request);
    }
}
