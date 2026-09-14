package com.wcop.ai;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GeminiResponse {

    private Boolean valid;

    private String department;

    private String problemType;

    private String priority;
}