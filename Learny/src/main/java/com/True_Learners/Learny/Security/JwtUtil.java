// src/main/java/com/True_Learners/Learny/Security/JwtUtil.java
package com.True_Learners.Learny.Security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * JWT (JSON Web Token) işlemleri için Utility sınıfı
 * 
 * JWT NEDİR?
 * - Stateless authentication için kullanılan token formatı
 * - 3 bölümden oluşur: Header.Payload.Signature
 * - Payload'da kullanıcı bilgileri (email, role, id) saklanır
 * - Signature ile token'ın değiştirilmediği garanti edilir
 * 
 * ÇALIŞMA PRENSİBİ:
 * 1. Login başarılı -> Token oluştur (generateToken)
 * 2. Frontend token'ı saklar (localStorage)
 * 3. Her istekte token gönderilir (Authorization header)
 * 4. Backend token'ı doğrular (validateToken)
 * 5. Token geçerliyse işlem devam eder
 * 
 * GÜVENLİK:
 * - SECRET_KEY değeri production'da environment variable'dan alınmalı
 * - Token süresi 24 saat (ihtiyaca göre ayarlanabilir)
 * - HMAC-SHA256 algoritması kullanılır
 */
@Component
public class JwtUtil {
    
    /**
     * Token imzalamak için kullanılan gizli anahtar
     * 
     * ÖNEMLİ GÜVENLİK NOTU:
     * - Bu anahtar production'da ASLA kodda durmamalı
     * - Environment variable veya secrets manager kullanılmalı
     * - En az 256 bit (32 karakter) olmalı
     */
    private static final String SECRET_KEY = "SmartEducationSecretKeyForJWT2024VerySecureAndLongKey12345";
    
    /**
     * Token'ın geçerlilik süresi (milisaniye cinsinden)
     * 24 saat = 1000ms * 60s * 60m * 24h
     */
    private static final long EXPIRATION_TIME = 1000 * 60 * 60 * 24; // 24 saat
    
    /**
     * HMAC-SHA256 için Key objesi oluşturur
     */
    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(SECRET_KEY.getBytes());
    }
    
    /**
     * Kullanıcı için JWT token oluşturur
     * 
     * TOKEN İÇERİĞİ:
     * - subject: Kullanıcı email (benzersiz identifier)
     * - claim "role": Kullanıcı rolü (Ogretmen/Ogrenci)
     * - claim "userId": Kullanıcı ID
     * - iat (issued at): Token oluşturulma zamanı
     * - exp (expiration): Token bitiş zamanı
     * 
     * @param email Kullanıcı email
     * @param role Kullanıcı rolü
     * @param userId Kullanıcı ID
     * @return JWT token string
     */
    public String generateToken(String email, String role, int userId) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        claims.put("userId", userId);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)  // Token'ın sahibi (kullanıcı email)
                .setIssuedAt(new Date())  // Token oluşturulma zamanı
                .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))  // Bitiş zamanı
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)  // İmzalama
                .compact();
    }
    
    /**
     * Token'dan email bilgisini çıkarır (subject)
     * 
     * @param token JWT token
     * @return Kullanıcı email
     */
    public String extractEmail(String token) {
        return extractClaims(token).getSubject();
    }
    
    /**
     * Token'dan rol bilgisini çıkarır
     * 
     * @param token JWT token
     * @return Kullanıcı rolü
     */
    public String extractRole(String token) {
        return (String) extractClaims(token).get("role");
    }
    
    /**
     * Token'dan user ID bilgisini çıkarır
     * 
     * @param token JWT token
     * @return Kullanıcı ID
     */
    public Integer extractUserId(String token) {
        return (Integer) extractClaims(token).get("userId");
    }
    
    /**
     * Token'ın geçerli olup olmadığını kontrol eder
     * 
     * KONTROLLER:
     * 1. Token'ın süresi dolmamış olmalı
     * 2. İmza doğru olmalı (değiştirilmemiş)
     * 3. Email bilgisi mevcut olmalı
     * 
     * @param token JWT token
     * @param email Doğrulanacak email
     * @return true: token geçerli, false: token geçersiz
     */
    public boolean validateToken(String token, String email) {
        try {
            String tokenEmail = extractEmail(token);
            return (tokenEmail.equals(email) && !isTokenExpired(token));
        } catch (Exception e) {
            // Token parse edilemezse veya imza yanlışsa exception fırlatır
            return false;
        }
    }
    
    /**
     * Token'ın süresinin dolup dolmadığını kontrol eder
     * 
     * @param token JWT token
     * @return true: süresi dolmuş, false: hala geçerli
     */
    private boolean isTokenExpired(String token) {
        return extractClaims(token).getExpiration().before(new Date());
    }
    
    /**
     * Token'dan tüm claims (payload) bilgilerini çıkarır
     * 
     * @param token JWT token
     * @return Claims objesi (tüm payload bilgileri)
     */
    private Claims extractClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}