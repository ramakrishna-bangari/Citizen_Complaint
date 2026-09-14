package com.wcop.service.impl;

import com.wcop.ai.GeminiRequest;
import com.wcop.ai.GeminiResponse;
import com.wcop.ai.GeminiService;
import com.wcop.service.AIService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AIServiceImpl implements AIService {

    private final GeminiService geminiService;

    @Override
    public GeminiResponse classifyComplaint(GeminiRequest request) {

        return geminiService.classifyComplaint(request);
    }
}