// src/main/java/com/True_Learners/Learny/Security/JwtAuthenticationFilter.java
package com.True_Learners.Learny.Security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT Authentication Filter
 * 
 * BU FILTER NE YAPAR?
 * Her HTTP isteğinde çalışır ve:
 * 1. Authorization header'ından JWT token'ı alır
 * 2. Token'ı validate eder
 * 3. Token geçerliyse kullanıcıyı Spring Security context'ine ekler
 * 4. Controller'a ulaşmadan önce authentication tamamlanır
 * 
 * ÇALIŞMA AKIŞI:
 * Request -> Filter -> Token kontrolü -> Authentication -> Controller
 * 
 * TOKEN FORMATI:
 * Authorization: Bearer <jwt_token>
 * 
 * ÖNEMLİ:
 * - OncePerRequestFilter: Her request için bir kez çalışır
 * - /api/auth/** endpoint'lerinde token kontrolü YOK (SecurityConfig'de permit all)
 * - Diğer tüm /api/** endpoint'lerinde token kontrolü VAR
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    
    private final JwtUtil jwtUtil;
    
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Her HTTP isteğinde çalışan ana method
     * 
     * AKIŞ:
     * 1. Authorization header'ı al
     * 2. Token'ı parse et (Bearer prefix'ini kaldır)
     * 3. Token'dan email çıkar
     * 4. Token'ı validate et
     * 5. Authentication objesi oluştur ve context'e ekle
     * 6. Filter chain'e devam et
     */
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        
        // 1. Authorization header'ını al
        final String authHeader = request.getHeader("Authorization");
        
        // Token yoksa veya "Bearer " ile başlamıyorsa, filter chain'e devam et
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }
        
        try {
            // 2. "Bearer " prefix'ini kaldırarak token'ı al
            // "Bearer eyJhbGc..." -> "eyJhbGc..."
            final String jwt = authHeader.substring(7);
            
            // 3. Token'dan email bilgisini çıkar
            final String userEmail = jwtUtil.extractEmail(jwt);
            
            // 4. Email var ve henüz authentication yapılmamışsa
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                
                // 5. Token'ı validate et
                if (jwtUtil.validateToken(jwt, userEmail)) {
                    
                    // 6. Token'dan rol bilgisini al
                    String role = jwtUtil.extractRole(jwt);
                    
                    // 7. Spring Security için authority oluştur
                    // "ROLE_" prefix'i Spring Security convention'ıdır
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority("ROLE_" + role);
                    
                    // 8. Authentication token oluştur
                    UsernamePasswordAuthenticationToken authToken = 
                        new UsernamePasswordAuthenticationToken(
                            userEmail,  // Principal (kimlik)
                            null,       // Credentials (şifre - JWT'de gerek yok)
                            Collections.singletonList(authority)  // Authorities (yetkiler)
                        );
                    
                    // 9. Request detaylarını authentication'a ekle
                    authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                    );
                    
                    // 10. Authentication'ı Security Context'e ekle
                    // Artık bu request authenticated olarak işaretlendi
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            }
        } catch (Exception e) {
            // Token parse hatası veya validation hatası
            // Log edilebilir, ama request devam eder (authentication olmadan)
            System.err.println("JWT Authentication Error: " + e.getMessage());
        }
        
        // Filter chain'e devam et (bir sonraki filter'a veya controller'a)
        filterChain.doFilter(request, response);
    }
}