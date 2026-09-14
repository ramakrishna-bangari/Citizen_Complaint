package com.wcop.service;

import com.wcop.ai.GeminiRequest;
import com.wcop.ai.GeminiResponse;

public interface AIService {

    GeminiResponse classifyComplaint(GeminiRequest request);
}