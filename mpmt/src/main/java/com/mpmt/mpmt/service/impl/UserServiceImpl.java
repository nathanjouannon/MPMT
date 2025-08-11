package com.mpmt.mpmt.service.impl;

import com.mpmt.mpmt.dao.ProjectRepository;
import com.mpmt.mpmt.dao.UserRepository;
import com.mpmt.mpmt.models.User;
import com.mpmt.mpmt.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;


    @Override
    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec l'id : " + userId));
    }
}
