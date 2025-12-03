// src/main/java/com/True_Learners/Learny/Business/AuthenticationService.java
package com.True_Learners.Learny.Business;

import com.True_Learners.Learny.DTOs.LoginRequestDTO;
import com.True_Learners.Learny.DTOs.LoginResponseDTO;
import com.True_Learners.Learny.DTOs.RegisterRequestDTO;
import com.True_Learners.Learny.DTOs.UserDTO;
import com.True_Learners.Learny.Entities.User;
import com.True_Learners.Learny.Security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Authentication işlemleri için Service sınıfı
 * 
 * BU SERVICE NE YAPAR?
 * 1. Login: Email/password kontrolü, JWT token oluşturma
 * 2. Register: Yeni kullanıcı oluşturma, password hashleme
 * 3. Logout: Client-side işlem (token silme)
 * 
 * GÜVENLİK ÖNLEMLERİ:
 * - Password asla plain text saklanmaz (BCrypt hash)
 * - Login başarısızında detaylı bilgi verilmez (güvenlik)
 * - Email unique kontrolü yapılır
 * - Input validasyonları DTO'larda yapılır
 */
@Service
public class AuthenticationService {
    
    private final IUserService userService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    
    @Autowired
    public AuthenticationService(IUserService userService, 
                                 PasswordEncoder passwordEncoder,
                                 JwtUtil jwtUtil) {
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }
    
    /**
     * Kullanıcı girişi (Login)
     * 
     * AKIŞ:
     * 1. Email ile kullanıcıyı bul
     * 2. Password'ü kontrol et (BCrypt)
     * 3. Geçerliyse JWT token oluştur
     * 4. Kullanıcı bilgileri ve token'ı döndür
     * 
     * GÜVENLİK:
     * - Password match kontrolü BCrypt ile yapılır
     * - Başarısız girişte "Email veya şifre hatalı" mesajı (detay yok)
     * - Token 24 saat geçerli
     * 
     * @param loginRequest Email ve password içeren DTO
     * @return Login başarılıysa token ve kullanıcı bilgileri
     * @throws RuntimeException Email bulunamazsa veya şifre yanlışsa
     */
    @Transactional(readOnly = true)
    public LoginResponseDTO login(LoginRequestDTO loginRequest) {
        // 1. Email ile kullanıcıyı bul
        User user = findUserByEmail(loginRequest.getEmail());
        
        if (user == null) {
            throw new RuntimeException("Email veya şifre hatalı");
        }
        
        // 2. Password kontrolü (BCrypt ile hash karşılaştırma)
        boolean passwordMatches = passwordEncoder.matches(
            loginRequest.getPassword(),  // Plain text password (frontend'den gelen)
            user.getPasswordHash()       // Hashed password (veritabanında saklanan)
        );
        
        if (!passwordMatches) {
            throw new RuntimeException("Email veya şifre hatalı");
        }
        
        // 3. JWT Token oluştur
        String token = jwtUtil.generateToken(
            user.getMail(),              // Subject (email)
            user.getRole().toString(),   // Claim: role
            user.getId()                 // Claim: userId
        );
        
        // 4. Response DTO oluştur (şifre bilgisi YOK)
        UserDTO userDTO = UserDTO.fromUser(user);
        
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(userDTO);
        response.setRole(user.getRole().toString());
        response.setMessage("Giriş başarılı");
        
        return response;
    }
    
    /**
     * Yeni kullanıcı kaydı (Register)
     * 
     * AKIŞ:
     * 1. Email unique kontrolü
     * 2. Username unique kontrolü
     * 3. Password'ü hashle (BCrypt)
     * 4. Yeni User entity oluştur
     * 5. Veritabanına kaydet
     * 6. JWT token oluştur ve döndür
     * 
     * GÜVENLİK:
     * - Password BCrypt ile hashlenip saklanır
     * - Email ve username unique olmalı
     * - Validasyonlar DTO'da yapılır (@Valid)
     * 
     * @param registerRequest Kullanıcı kayıt bilgileri
     * @return Kayıt başarılıysa token ve kullanıcı bilgileri
     * @throws RuntimeException Email veya username zaten varsa
     */
    @Transactional
    public LoginResponseDTO register(RegisterRequestDTO registerRequest) {
        // 1. Email unique kontrolü
        User existingUserByEmail = findUserByEmail(registerRequest.getMail());
        if (existingUserByEmail != null) {
            throw new RuntimeException("Bu email adresi zaten kullanılıyor");
        }
        
        // 2. Username unique kontrolü
        User existingUserByUsername = findUserByUsername(registerRequest.getUserName());
        if (existingUserByUsername != null) {
            throw new RuntimeException("Bu kullanıcı adı zaten kullanılıyor");
        }
        
        // 3. Password'ü hashle
        String hashedPassword = passwordEncoder.encode(registerRequest.getPassword());
        
        // 4. Role enum'a çevir
        User.Role role;
        try {
            role = User.Role.valueOf(registerRequest.getRole());
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Geçersiz rol: " + registerRequest.getRole());
        }
        
        // 5. Yeni User entity oluştur
        User newUser = new User();
        newUser.setUserName(registerRequest.getUserName());
        newUser.setPasswordHash(hashedPassword);  // HASHED password
        newUser.setNameSurname(registerRequest.getNameSurname());
        newUser.setMail(registerRequest.getMail());
        newUser.setRole(role);
        
        // 6. Veritabanına kaydet
        userService.add(newUser);
        
        // 7. JWT Token oluştur (otomatik login)
        String token = jwtUtil.generateToken(
            newUser.getMail(),
            newUser.getRole().toString(),
            newUser.getId()
        );
        
        // 8. Response DTO oluştur
        UserDTO userDTO = UserDTO.fromUser(newUser);
        
        LoginResponseDTO response = new LoginResponseDTO();
        response.setToken(token);
        response.setUser(userDTO);
        response.setRole(newUser.getRole().toString());
        response.setMessage("Kayıt başarılı");
        
        return response;
    }
    
    /**
     * Kullanıcı çıkışı (Logout)
     * 
     * JWT İLE LOGOUT:
     * - Server-side bir işlem YOK
     * - Client-side token'ı siler (localStorage)
     * - Token'ın süresi dolana kadar geçerlidir
     * - Token'ı blacklist'e almak için Redis kullanılabilir (gelişmiş)
     * 
     * @return Başarı mesajı
     */
    public String logout() {
        // JWT ile stateless authentication kullanıldığında
        // logout işlemi client-side yapılır (token silinir)
        // Server-side bir işlem gerekmez
        
        return "Çıkış başarılı. Token client-side silinmelidir.";
    }
    
    // ========== HELPER METHODS ==========
    
    /**
     * Email ile kullanıcı bulma
     * Veritabanında tüm kullanıcıları alıp email ile filtreler
     */
    private User findUserByEmail(String email) {
        List<User> allUsers = userService.getAll();
        return allUsers.stream()
                .filter(user -> user.getMail().equalsIgnoreCase(email))
                .findFirst()
                .orElse(null);
    }
    
    /**
     * Username ile kullanıcı bulma
     * Veritabanında tüm kullanıcıları alıp username ile filtreler
     */
    private User findUserByUsername(String username) {
        List<User> allUsers = userService.getAll();
        return allUsers.stream()
                .filter(user -> user.getUserName().equalsIgnoreCase(username))
                .findFirst()
                .orElse(null);
    }
}