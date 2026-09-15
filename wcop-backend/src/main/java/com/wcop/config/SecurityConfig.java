package com.wcop.config;

import com.wcop.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;


@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(csrf->csrf.disable())

                // STATELESS JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

                // AUTHORIZATION
                .authorizeHttpRequests(auth -> auth

                        // AUTHENTICATION
                        .requestMatchers("/api/auth/**").permitAll()

                        // CITIZEN
                        // Create complaint
                        .requestMatchers(HttpMethod.POST, "/api/complaints").hasRole("CITIZEN")
                        // Citizen's own complaints
                        .requestMatchers(HttpMethod.GET, "/api/complaints/my").hasRole("CITIZEN")
                        // Citizen dashboard
                        .requestMatchers(HttpMethod.GET, "/api/dashboard/citizen").hasRole("CITIZEN")

                        // Paginated complaints
                        // ADMIN + OFFICER
                        .requestMatchers(HttpMethod.GET, "/api/complaints/page").hasAnyRole("ADMIN", "OFFICER")

                        // All complaints
                        // ADMIN + OFFICER
                        .requestMatchers(HttpMethod.GET, "/api/complaints").hasAnyRole("ADMIN", "OFFICER")


                        // Single complaint
                        // Authenticated users
                        .requestMatchers(HttpMethod.GET, "/api/complaints/*").authenticated()


                        // Complaint history
                        .requestMatchers(HttpMethod.GET, "/api/complaints/*/history").authenticated()


                        // Update complaint status
                        .requestMatchers(HttpMethod.PUT, "/api/complaints/*/status").hasAnyRole("ADMIN", "OFFICER")


                        // Reject complaint
                        .requestMatchers(HttpMethod.PUT, "/api/complaints/*/reject").hasAnyRole("ADMIN", "OFFICER")

                        // OFFICER APIs
                        .requestMatchers("/api/officer/**").hasRole("OFFICER")


                        // ADMIN APIs
                        .requestMatchers("/api/admin/**").hasRole("ADMIN")

                        // USER PROFILE

                        .requestMatchers(HttpMethod.GET, "/api/users/profile").authenticated()

                        .requestMatchers(HttpMethod.PUT, "/api/users/profile").authenticated()

                        .requestMatchers(HttpMethod.PUT, "/api/users/password").authenticated()

                        // EVERYTHING ELSE
                        .anyRequest().authenticated())

                // JWT FILTER
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }



    @Bean
    public CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        // React
        configuration.setAllowedOrigins(List.of("https://citizen-complaints.vercel.app"));

        // HTTP methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));

        // Headers
        configuration.setAllowedHeaders(List.of("*"));

        // Expose Authorization header
        configuration.setExposedHeaders(List.of("Authorization"));

        // Credentials
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration("/**", configuration);

        return source;
    }


    // PASSWORD ENCODER

    @Bean
    public PasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();
    }


    // AUTHENTICATION MANAGER

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {

        return configuration.getAuthenticationManager();
    }
}