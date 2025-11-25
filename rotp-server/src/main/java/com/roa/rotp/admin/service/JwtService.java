package com.roa.rotp.admin.service;

import org.springframework.security.core.userdetails.UserDetails;

import java.util.Date;

public interface JwtService {
    String generateAccessToken(String username);
    String generateRefreshToken(String username);

    String extractUsername(String token);

    boolean isAccessTokenValid(String token, UserDetails userDetails);
    boolean isRefreshTokenValid(String token, UserDetails userDetails);

    Date extractExpiration(String token);
}