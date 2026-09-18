package com.wcop.security;

import com.wcop.entity.User;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

import lombok.RequiredArgsConstructor;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;

import java.util.Date;
import java.util.function.Function;

@Service
@RequiredArgsConstructor
public class JwtService {

    private final JwtProperties jwtProperties;

    public String generateAccessToken(UserDetails userDetails) {

        if (!(userDetails instanceof User user)) {
            throw new IllegalArgumentException("Invalid user principal.");
        }

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessTokenExpiration()))
                .signWith(getSigningKey())
                .compact();
    }

    public String generateRefreshToken(UserDetails userDetails) {

        if (!(userDetails instanceof User user)) {
            throw new IllegalArgumentException("Invalid user principal.");
        }

        return Jwts.builder()
                .subject(String.valueOf(user.getId()))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshTokenExpiration()))
                .signWith(getSigningKey())
                .compact();
    }

    public String extractUsername(String token) {

        try {
            return extractClaim(token, Claims::getSubject);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public Long extractUserId(String token) {

        try {
            String subject = extractClaim(token, Claims::getSubject);

            if (subject == null || subject.isBlank()) {
                return null;
            }

            return Long.valueOf(subject);
        } catch (JwtException | IllegalArgumentException e) {
            return null;
        }
    }

    public Date extractExpiration(String token) {

        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> resolver) {

        Claims claims = extractAllClaims(token);

        return resolver.apply(claims);
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {

        try {

            if (!(userDetails instanceof User user)) {
                return false;
            }

            Long userId = extractUserId(token);

            return userId != null && userId.equals(user.getId()) && !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException e) {

            return false;
        }
    }

    private boolean isTokenExpired(String token) {

        Date expiration = extractExpiration(token);

        return expiration == null || expiration.before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());

        return Keys.hmacShaKeyFor(keyBytes);
    }
}