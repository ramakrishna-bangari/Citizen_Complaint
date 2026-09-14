package com.wcop.security;

import com.wcop.entity.User;
import com.wcop.exception.ResourceNotFoundException;
import com.wcop.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {

        User user;

        if (identifier.contains("@")) {

            user = userRepository.findByEmail(identifier.toLowerCase()).orElseThrow(() -> new ResourceNotFoundException("User not found."));

        } else {

            user = userRepository.findByPhone(identifier).orElseThrow(() -> new ResourceNotFoundException("User not found."));
        }
        return user;
    }
}