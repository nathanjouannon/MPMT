package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.UserRepository;
import com.mpmt.mpmt.dto.LoginRequest;
import com.mpmt.mpmt.dto.LoginResponse;
import com.mpmt.mpmt.dto.RegisterRequest;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AuthServiceImpl implements AuthService {
    @Autowired
    private UserRepository userRepository;

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email déjà utilisé");
        }

        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword((request.getPassword())); // Attention password en clair
        user.setCreatedAt(LocalDateTime.now());

        return userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());

        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Utilisateur non trouvé.");
        }

        User user = optionalUser.get();

        if (!user.getPassword().equals(request.getPassword())) {
            throw new RuntimeException("Mot de passe incorrect.");
        }

        String token = com.mpmt.util.JwtUtil.generateToken(user.getEmail());

        return new LoginResponse(user.getId(), user.getUsername(), user.getEmail(), token);
    }
}
