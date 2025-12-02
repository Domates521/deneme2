// src/api/client.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 20000 // 20 saniye
});

/**
 * REQUEST INTERCEPTOR
 * 
 * NE YAPAR?
 * - Her istekten ÖNCE çalışır
 * - localStorage'dan JWT token'ı alır
 * - Token varsa Authorization header'ına ekler
 * 
 * NEDEN GEREKLİ?
 * - Backend korumalı endpoint'ler JWT token bekler
 * - Her istekte manuel olarak header eklemek yerine
 *   otomatik olarak eklenir
 * 
 * TOKEN FORMATI:
 * Authorization: Bearer <token>
 */
apiClient.interceptors.request.use(
  (config) => {
    // localStorage'dan token'ı al
    const token = localStorage.getItem("authToken");
    
    // Token varsa Authorization header'ına ekle
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // İstek gönderilmeden önce hata oluşursa
    return Promise.reject(error);
  }
);

/**
 * RESPONSE INTERCEPTOR
 * 
 * NE YAPAR?
 * - Her yanıttan SONRA çalışır
 * - Hata durumlarını yakalar
 * - 401 Unauthorized hatası gelirse kullanıcıyı logout yapar
 * 
 * HATA KODLARI:
 * - 401: Unauthorized (token geçersiz veya süre dolmuş)
 * - 403: Forbidden (yetki yok)
 * - 500: Server error
 */
apiClient.interceptors.response.use(
  (response) => {
    // Başarılı yanıt - olduğu gibi döndür
    return response;
  },
  (error) => {
    // Hata durumu
    
    if (error.response) {
      // Backend'den yanıt geldi ama hata kodu var
      const status = error.response.status;
      
      if (status === 401) {
        // 401 Unauthorized - Token geçersiz veya süre dolmuş
        console.warn("Token geçersiz veya süre dolmuş. Çıkış yapılıyor...");
        
        // localStorage'ı temizle
        localStorage.removeItem("authToken");
        localStorage.removeItem("user");
        localStorage.removeItem("userRole");
        
        // Kullanıcıyı login sayfasına yönlendir
        // window.location.href = "/login"; // AuthContext'te yapılacak
      }
      
      if (status === 403) {
        // 403 Forbidden - Yetki yok
        console.warn("Bu işlem için yetkiniz yok");
      }
      
      if (status >= 500) {
        // 500+ Server Error
        console.error("Sunucu hatası:", error.response.data);
      }
    } else if (error.request) {
      // İstek gönderildi ama yanıt alınamadı
      console.error("Sunucuya ulaşılamadı:", error.message);
    } else {
      // İstek gönderilirken hata oluştu
      console.error("İstek hatası:", error.message);
    }
    
    // Hatayı üst katmana ilet
    return Promise.reject(error);
  }
);

export default apiClient;