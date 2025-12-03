// src/main/java/com/True_Learners/Learny/Security/SecurityConfig.java
package com.True_Learners.Learny.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
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

/**
 * Spring Security ana yapılandırma sınıfı
 * 
 * BU SINIF NE YAPAR?
 * 1. CORS ayarlarını yapar (frontend-backend iletişimi)
 * 2. Hangi endpoint'lerin korumalı olduğunu belirler
 * 3. JWT filter'ı devreye sokar
 * 4. Password encoder'ı tanımlar (BCrypt)
 * 5. Session yönetimini ayarlar (STATELESS - JWT kullanımı için)
 * 
 * GÜVENLİK KATMANLARI:
 * - Authentication: Kullanıcı kim? (JWT token ile)
 * - Authorization: Kullanıcı ne yapabilir? (Role bazlı)
 * - CORS: Hangi domain'lerden istek kabul edilir?
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    
    private final JwtAuthenticationFilter jwtAuthFilter;
    
    /**
     * Constructor injection ile JWT filter'ı alıyoruz
     */
    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter) {
        this.jwtAuthFilter = jwtAuthFilter;
    }
    
    /**
     * Security Filter Chain - Güvenlik kurallarının tanımlandığı yer
     * 
     * AÇIKLAMALAR:
     * 1. CORS: Cross-Origin isteklere izin ver
     * 2. CSRF: Devre dışı (JWT kullandığımız için gerekli değil)
     * 3. Authorization Rules:
     *    - /api/auth/** : Herkes erişebilir (login, register)
     *    - Diğer tüm /api/** : Authentication gerekli
     * 4. Session Management: STATELESS (JWT kullanımı)
     * 5. JWT Filter: Her istekte JWT kontrolü yap
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CORS ayarlarını aktif et
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            
            // CSRF korumasını kapat (JWT kullanıyoruz, cookie kullanmıyoruz)
            .csrf(csrf -> csrf.disable())
            
            // Endpoint authorization kuralları
            .authorizeHttpRequests(auth -> auth
                // Authentication endpoint'leri - Herkes erişebilir
                .requestMatchers("/api/auth/**").permitAll()
                
                // Diğer tüm API endpoint'leri - Authentication gerekli
                .requestMatchers("/api/**").authenticated()
                
                // Diğer tüm istekler - Authentication gerekli
                .anyRequest().authenticated()
            )
            
            // Session yönetimi - STATELESS (JWT için)
            // Her istek bağımsızdır, session saklanmaz
            .sessionManagement(session -> 
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            
            // JWT Authentication Filter'ı ekle
            // Her istekte JWT token kontrolü yapılır
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
    
    /**
     * CORS (Cross-Origin Resource Sharing) yapılandırması
     * 
     * CORS NEDİR?
     * - Farklı domain'lerden gelen istekleri kontrol eder
     * - Frontend (localhost:5173) -> Backend (localhost:8080)
     * - Browser güvenlik politikası gereği CORS ayarı şart
     * 
     * AYARLAR:
     * - allowedOrigins: Hangi domain'lerden istek kabul edilir
     * - allowedMethods: Hangi HTTP methodları kabul edilir
     * - allowedHeaders: Hangi header'lar gönderilebilir
     * - allowCredentials: Cookie, Authorization header gönderilebilir
     * - maxAge: Preflight request cache süresi
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // İzin verilen origin'ler (frontend URL'leri)
        // Production'da sadece gerçek frontend URL'i olmalı
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:5173",  // Vite dev server
            "http://localhost:3000",  // Alternative port
            "http://localhost:5174"   // Alternative port
        ));
        
        // İzin verilen HTTP methodları
        configuration.setAllowedMethods(Arrays.asList(
            "GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"
        ));
        
        // İzin verilen header'lar
        configuration.setAllowedHeaders(Arrays.asList(
            "Authorization",  // JWT token için
            "Content-Type",   // JSON data için
            "Accept",
            "Origin",
            "X-Requested-With"
        ));
        
        // Credentials (cookies, authorization headers) gönderilmesine izin ver
        configuration.setAllowCredentials(true);
        
        // Preflight request (OPTIONS) sonucunu 1 saat cache'le
        configuration.setMaxAge(3600L);
        
        // Tüm path'ler için bu CORS ayarlarını uygula
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", configuration);
        
        return source;
    }
    
    /**
     * Password Encoder Bean - Şifre hashleme için
     * 
     * BCrypt NEDİR?
     * - Güvenli password hashing algoritması
     * - Her hash farklıdır (salt kullanır)
     * - Brute force saldırılarına karşı yavaş çalışır (kasıtlı)
     * - Spring Security'nin önerdiği algoritmadır
     * 
     * KULLANIM:
     * - Register: passwordEncoder.encode(plainPassword)
     * - Login: passwordEncoder.matches(plainPassword, hashedPassword)
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}