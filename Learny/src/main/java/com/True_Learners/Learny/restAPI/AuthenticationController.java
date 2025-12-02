// src/main/java/com/True_Learners/Learny/restAPI/AuthenticationController.java
package com.True_Learners.Learny.restAPI;

import com.True_Learners.Learny.Business.AuthenticationService;
import com.True_Learners.Learny.DTOs.LoginRequestDTO;
import com.True_Learners.Learny.DTOs.LoginResponseDTO;
import com.True_Learners.Learny.DTOs.RegisterRequestDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication işlemleri için REST API Controller
 * 
 * ENDPOINT'LER:
 * - POST /api/auth/login    : Kullanıcı girişi
 * - POST /api/auth/register : Yeni kullanıcı kaydı
 * - POST /api/auth/logout   : Kullanıcı çıkışı
 * 
 * GÜVENLİK:
 * - Bu endpoint'ler SecurityConfig'de permitAll() olarak ayarlanmıştır
 * - Herkes erişebilir (authentication gerekmez)
 * - CORS açık (frontend erişebilir)
 * 
 * VALİDASYON:
 * - @Valid annotation ile DTO validasyonları otomatik çalışır
 * - Hatalı input için 400 Bad Request döner
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthenticationController {
    
    private final AuthenticationService authService;
    
    @Autowired
    public AuthenticationController(AuthenticationService authService) {
        this.authService = authService;
    }
    
    /**
     * Kullanıcı girişi (Login)
     * 
     * ENDPOINT: POST /api/auth/login
     * 
     * REQUEST BODY:
     * {
     *   "email": "user@example.com",
     *   "password": "123456"
     * }
     * 
     * SUCCESS RESPONSE (200):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIs...",
     *   "user": {
     *     "id": 1,
     *     "userName": "user1",
     *     "nameSurname": "John Doe",
     *     "mail": "user@example.com",
     *     "role": "Ogrenci"
     *   },
     *   "role": "Ogrenci",
     *   "message": "Giriş başarılı"
     * }
     * 
     * ERROR RESPONSE (400):
     * {
     *   "error": "Email veya şifre hatalı"
     * }
     * 
     * FRONTEND KULLANIMI:
     * 1. Token'ı localStorage'a kaydet
     * 2. Her istekte Authorization header'ına ekle
     * 3. User bilgilerini state'e kaydet
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequestDTO loginRequest) {
        try {
            // Login işlemini yap
            LoginResponseDTO response = authService.login(loginRequest);
            
            // Başarılı - 200 OK
            return ResponseEntity.ok(response);
            
        } catch (RuntimeException e) {
            // Hata - 400 Bad Request
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Yeni kullanıcı kaydı (Register)
     * 
     * ENDPOINT: POST /api/auth/register
     * 
     * REQUEST BODY:
     * {
     *   "userName": "newuser",
     *   "password": "123456",
     *   "nameSurname": "John Doe",
     *   "mail": "newuser@example.com",
     *   "role": "Ogrenci"
     * }
     * 
     * SUCCESS RESPONSE (201):
     * {
     *   "token": "eyJhbGciOiJIUzI1NiIs...",
     *   "user": { ... },
     *   "role": "Ogrenci",
     *   "message": "Kayıt başarılı"
     * }
     * 
     * ERROR RESPONSE (400):
     * {
     *   "error": "Bu email adresi zaten kullanılıyor"
     * }
     * 
     * VALİDASYON KURALLARI:
     * - userName: 3-50 karakter
     * - password: minimum 6 karakter
     * - mail: geçerli email formatı
     * - role: "Ogretmen" veya "Ogrenci"
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO registerRequest) {
        try {
            // Kayıt işlemini yap
            LoginResponseDTO response = authService.register(registerRequest);
            
            // Başarılı - 201 Created
            return ResponseEntity
                    .status(HttpStatus.CREATED)
                    .body(response);
            
        } catch (RuntimeException e) {
            // Hata - 400 Bad Request
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(new ErrorResponse(e.getMessage()));
        }
    }
    
    /**
     * Kullanıcı çıkışı (Logout)
     * 
     * ENDPOINT: POST /api/auth/logout
     * 
     * NOT:
     * - JWT ile logout server-side yapılmaz
     * - Client-side token silinir (localStorage.removeItem)
     * - Bu endpoint bilgilendirme amaçlıdır
     * 
     * SUCCESS RESPONSE (200):
     * {
     *   "message": "Çıkış başarılı. Token client-side silinmelidir."
     * }
     * 
     * FRONTEND KULLANIMI:
     * 1. localStorage'dan token'ı sil
     * 2. User state'ini temizle
     * 3. Login sayfasına yönlendir
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        String message = authService.logout();
        return ResponseEntity.ok(new SuccessResponse(message));
    }
    
    /**
     * Token doğrulama endpoint'i (Opsiyonel)
     * Frontend sayfa yüklendiğinde token'ın hala geçerli olup olmadığını kontrol edebilir
     * 
     * ENDPOINT: GET /api/auth/validate
     * 
     * REQUEST HEADER:
     * Authorization: Bearer <token>
     * 
     * SUCCESS RESPONSE (200):
     * {
     *   "valid": true,
     *   "message": "Token geçerli"
     * }
     * 
     * ERROR RESPONSE (401):
     * Token geçersiz veya süresi dolmuş
     */
    @GetMapping("/validate")
    public ResponseEntity<?> validateToken() {
        // Bu endpoint'e ulaşıldıysa token geçerlidir
        // Çünkü JwtAuthenticationFilter zaten kontrol etti
        return ResponseEntity.ok(new SuccessResponse("Token geçerli"));
    }
    
    // ========== RESPONSE CLASSES ==========
    
    /**
     * Hata response için helper class
     */
    private static class ErrorResponse {
        private String error;
        
        public ErrorResponse(String error) {
            this.error = error;
        }
        
        public String getError() {
            return error;
        }
        
        public void setError(String error) {
            this.error = error;
        }
    }
    
    /**
     * Başarı response için helper class
     */
    private static class SuccessResponse {
        private String message;
        
        public SuccessResponse(String message) {
            this.message = message;
        }
        
        public String getMessage() {
            return message;
        }
        
        public void setMessage(String message) {
            this.message = message;
        }
    }
}