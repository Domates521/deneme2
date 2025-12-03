// src/main/java/com/True_Learners/Learny/Security/SecurityConfig.java
package com.True_Learners.Learny.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    
    /**
     * ✅ DÜZELTİLMİŞ Security Filter Chain
     * 
     * DEĞİŞİKLİK:
     * - Tüm HTTP metodları (GET, POST, PUT, DELETE) için izinler açıkça belirtildi
     * - /api/exams için GET metodu açıkça izin verildi
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            // CORS ayarları
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // CSRF devre dışı (JWT kullanıldığı için)
            .csrf(csrf -> csrf.disable())
            
            // Authorization kuralları
            .authorizeHttpRequests(auth -> auth
                // Authentication gerektirmeyen endpoint'ler
                .requestMatchers("/api/auth/**").permitAll()
                
                // ✅ ÇÖZÜM: TÜM HTTP metodları için authenticated
                // GET, POST, PUT, DELETE hepsi dahil
                .requestMatchers(HttpMethod.GET, "/api/**").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/**").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/**").authenticated()
                
                // Diğer tüm istekler authenticated olmalı
                .anyRequest().authenticated()
            )
            
            // Session yönetimi - STATELESS (JWT için)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // JWT filter'ı ekle
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    /**
     * CORS yapılandırması
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // İzin verilen origin'ler
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",
            "http://localhost:3000",
            "http://localhost:5174"
        ));
        
        // İzin verilen HTTP metodları
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // İzin verilen header'lar
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With"
        ));
        
        // Credentials (cookies, authorization headers) izni
        configuration.setAllowCredentials(true);
        
        // Preflight request cache süresi
        configuration.setMaxAge(3600L);
        
        // Tüm path'ler için uygula
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        
        return source;
    }
    
    /**
     * Password Encoder Bean
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}