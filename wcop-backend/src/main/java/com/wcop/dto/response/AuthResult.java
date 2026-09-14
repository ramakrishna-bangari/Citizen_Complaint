package com.wcop.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResult {

    private String accessToken;

    private String refreshToken;

    private UserResponse user;
}