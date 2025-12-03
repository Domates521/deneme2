// src/main/java/com/True_Learners/Learny/DTOs/LoginRequestDTO.java
package com.True_Learners.Learny.DTOs;

import jakarta.validation.constraints.NotBlank;

/**
 * Login işlemi için kullanılan DTO
 * Frontend'den gelen email ve şifre bilgilerini taşır
 * 
 * AÇIKLAMA:
 * - @NotBlank: Alanın boş olmamasını garanti eder
 * - Email ve password güvenli şekilde backend'e iletilir
 * - Hassas bilgiler (password) hash'lenmiş şekilde saklanır
 */
public class LoginRequestDTO {
    
    @NotBlank(message = "Email alanı boş bırakılamaz")
    private String email;
    
    @NotBlank(message = "Şifre alanı boş bırakılamaz")
    private String password;
    
    // Constructors
    public LoginRequestDTO() {}
    
    public LoginRequestDTO(String email, String password) {
        this.email = email;
        this.password = password;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
}