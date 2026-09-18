package com.wcop.security;

import com.wcop.entity.User;
import com.wcop.repository.UserRepository;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.lang.NonNull;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {

            String token = getAccessToken(request);

            if (token == null || token.isBlank()) {
                filterChain.doFilter(request, response);
                return;
            }

            if (SecurityContextHolder
                    .getContext()
                    .getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }

            Long userId = jwtService.extractUserId(token);

            if (userId == null) {
                filterChain.doFilter(request, response);
                return;
            }

            User user = userRepository.findById(userId).orElse(null);

            if (user == null) {
                filterChain.doFilter(request, response);
                return;
            }

            if (!Boolean.TRUE.equals(user.getIsActive())) {
                filterChain.doFilter(request, response);
                return;
            }

            if (jwtService.isTokenValid(token, user)) {

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        user,
                        null,
                        user.getAuthorities());

                authentication.setDetails(
                        new WebAuthenticationDetailsSource()
                                .buildDetails(request));

                SecurityContextHolder
                        .getContext()
                        .setAuthentication(authentication);
            }

        } catch (Exception exception) {

            log.debug(
                    "JWT authentication failed: {}",
                    exception.getMessage());

            SecurityContextHolder.clearContext();
        }

        filterChain.doFilter(request, response);
    }

    private String getAccessToken(HttpServletRequest request) {

        String authorization = request.getHeader("Authorization");

        if (authorization != null
                && authorization.startsWith("Bearer ")) {
            return authorization.substring(7);
        }

        Cookie[] cookies = request.getCookies();

        if (cookies != null) {

            for (Cookie cookie : cookies) {

                if ("accessToken".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        return null;
    }
}