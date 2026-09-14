package com.wcop.ai;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeminiRequest {

    private String title;
    private String description;
    private String imageUrl;
}