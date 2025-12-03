// src/main/java/com/True_Learners/Learny/DTOs/LoginResponseDTO.java
package com.True_Learners.Learny.DTOs;

/**
 * Login başarılı olduğunda frontend'e dönen DTO
 * 
 * AÇIKLAMA:
 * - token: JWT token - Frontend bunu localStorage'da saklar
 * - user: Kullanıcı bilgileri (şifre HARİÇ)
 * - role: Kullanıcının rolü (Ogretmen/Ogrenci)
 * - message: İşlem sonucu mesajı
 * 
 * JWT TOKEN KULLANIMI:
 * Frontend bu token'ı her istekte Authorization header'ında gönderir:
 * Authorization: Bearer <token>
 */
public class LoginResponseDTO {
    
    private String token;
    private UserDTO user;
    private String role;
    private String message;
    
    // Constructors
    public LoginResponseDTO() {}
    
    public LoginResponseDTO(String token, UserDTO user, String role, String message) {
        this.token = token;
        this.user = user;
        this.role = role;
        this.message = message;
    }
    
    // Getters and Setters
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public UserDTO getUser() {
        return user;
    }
    
    public void setUser(UserDTO user) {
        this.user = user;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
}