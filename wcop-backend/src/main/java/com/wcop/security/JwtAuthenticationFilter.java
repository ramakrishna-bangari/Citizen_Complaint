package com.wcop.security;

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
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;

    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain) throws ServletException, IOException {

        try {
            // GET TOKEN
            String token = getAccessToken(request);
            if (token == null || token.isBlank()) {

                filterChain.doFilter(request, response);
                return;
            }

            // ALREADY AUTHENTICATED
            if (SecurityContextHolder.getContext().getAuthentication() != null) {
                filterChain.doFilter(request, response);
                return;
            }
            // EXTRACT USERNAME
            String username = jwtService.extractUsername(token);
            if (username == null || username.isBlank()) {
                filterChain.doFilter(request, response);
                return;
            }

            // LOAD USER
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            // VALIDATE JWT
            if (jwtService.isTokenValid(token, userDetails)) {

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);

            }

        } catch (Exception exception) {

            log.debug("JWT authentication failed: {}", exception.getMessage());
            SecurityContextHolder.clearContext();
        }
        // CONTINUE REQUEST
        filterChain.doFilter(request, response);
    }

    // GET ACCESS TOKEN
    private String getAccessToken(HttpServletRequest request) {

        // OPTION 1: AUTHORIZATION HEADER
        String authorization = request.getHeader("Authorization");
        if (authorization != null && authorization.startsWith("Bearer ")) {

            return authorization.substring(7);
        }
        // OPTION 2: COOKIE
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