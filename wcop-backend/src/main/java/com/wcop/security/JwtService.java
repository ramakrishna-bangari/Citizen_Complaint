package com.wcop.security;

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

    // GENERATE ACCESS TOKEN

    public String generateAccessToken(UserDetails userDetails) {

        return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + jwtProperties.getAccessTokenExpiration())).signWith(getSigningKey()).compact();
    }

    // GENERATE REFRESH TOKEN
    public String generateRefreshToken(UserDetails userDetails) {

        return Jwts.builder().subject(userDetails.getUsername()).issuedAt(new Date()).expiration(new Date(System.currentTimeMillis() + jwtProperties.getRefreshTokenExpiration())).signWith(getSigningKey()).compact();
    }

    public String extractUsername(String token) {

        try {
            return extractClaim(token, Claims::getSubject);
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
            String username = extractClaim(token, Claims::getSubject);
            return username != null && username.equals(userDetails.getUsername()) && !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());
    }

    private Claims extractAllClaims(String token) {

        return Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token).getPayload();
    }


    private SecretKey getSigningKey() {

        byte[] keyBytes = Decoders.BASE64.decode(jwtProperties.getSecret());

        return Keys.hmacShaKeyFor(keyBytes);
    }
}