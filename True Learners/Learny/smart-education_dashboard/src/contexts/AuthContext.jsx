// src/contexts/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as loginApi, logout as logoutApi, getCurrentUser } from "../api/AuthApi";

/**
 * AUTHENTICATION CONTEXT
 * 
 * BU CONTEXT NE İŞE YARAR?
 * - Kullanıcı authentication state'ini global olarak yönetir
 * - Login, logout, register işlemlerini sağlar
 * - Tüm componentler bu context'e erişebilir
 * - Sayfa yenilendiğinde kullanıcı oturumu devam eder
 * 
 * KULLANIM AMACI:
 * - Her component'te localStorage'dan token kontrol etmek yerine
 *   tek bir yerden yönetmek
 * - Kullanıcı bilgilerini tüm uygulama boyunca paylaşmak
 * - Login/logout durumunda tüm componentleri otomatik güncelle
 * 
 * ÖRNEK KULLANIM:
 * const { user, login, logout, isAuthenticated } = useAuth();
 * 
 * if (isAuthenticated) {
 *   // Kullanıcı giriş yapmış
 *   console.log(user.nameSurname);
 * }
 */

// Context oluştur
const AuthContext = createContext(null);

/**
 * AuthProvider Component
 * 
 * NE YAPAR?
 * - Authentication state'ini tutar (user, loading)
 * - Login, logout, register fonksiyonlarını sağlar
 * - Sayfa yüklendiğinde localStorage'dan kullanıcıyı yükler
 * 
 * STATE:
 * - user: Kullanıcı bilgileri (id, userName, mail, role) veya null
 * - loading: Başlangıçta localStorage'dan yükleme yapılırken true
 * 
 * FONKSIYONLAR:
 * - login: Email/password ile giriş yap
 * - logout: Çıkış yap
 * - setAuthUser: Kullanıcıyı direkt set et (register için)
 * - isAuthenticated: Kullanıcı giriş yapmış mı?
 */
export function AuthProvider({ children }) {
  // STATE
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /**
   * SAYFA YÜKLENDİĞİNDE localStorage'DAN KULLANICIYI YÜKLE
   * 
   * AKIŞ:
   * 1. Component mount olduğunda çalışır (useEffect)
   * 2. localStorage'dan kullanıcı bilgilerini al
   * 3. Kullanıcı varsa state'e kaydet
   * 4. Loading'i false yap
   * 
   * NEDEN GEREKLİ?
   * - Sayfa yenilendiğinde kullanıcı oturumu devam etsin
   * - F5 yapınca login sayfasına atmasın
   */
  useEffect(() => {
    // localStorage'dan kullanıcıyı yükle
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      setUser(currentUser);
    }
    
    // Loading'i false yap - artık sayfa render edilebilir
    setLoading(false);
  }, []); // Boş dependency array = sadece ilk render'da çalış

  /**
   * LOGIN FONKSIYONU
   * 
   * AKIŞ:
   * 1. authApi.login ile backend'e istek gönder
   * 2. Backend token ve kullanıcı bilgilerini döner
   * 3. Kullanıcı bilgilerini state'e kaydet
   * 4. localStorage'a kaydetme authApi'de yapılır
   * 
   * @param {string} email - Kullanıcı email
   * @param {string} password - Kullanıcı şifre
   * @returns {Promise<Object>} - { token, user, role, message }
   * @throws {Error} - Giriş başarısızsa hata fırlatır
   * 
   * KULLANIM:
   * try {
   *   await login(email, password);
   *   // Giriş başarılı - kullanıcı dashboard'a yönlendirilebilir
   * } catch (error) {
   *   // Hata mesajını göster
   *   alert(error.message);
   * }
   */
  const login = async (email, password) => {
    try {
      // API'ye login isteği gönder
      const response = await loginApi(email, password);
      
      // Kullanıcı bilgilerini state'e kaydet
      setUser(response.user);
      
      return response;
    } catch (error) {
      // Hatayı üst katmana ilet
      throw error;
    }
  };

  /**
   * SET AUTH USER FONKSIYONU (REGISTER İÇİN)
   * 
   * AKIŞ:
   * - Register sonrası kullanıcıyı direkt state'e kaydet
   * - Token zaten register API'de localStorage'a kaydedilmiştir
   * 
   * @param {Object} userData - Kullanıcı bilgileri
   * 
   * KULLANIM:
   * const response = await register(...);
   * setAuthUser(response.user);
   * 
   * NEDEN GEREKLİ?
   * - login() fonksiyonu email/password bekler
   * - Register'da zaten kullanıcı bilgileri ve token var
   * - Tekrar API çağrısı yapmaya gerek yok
   */
  const setAuthUser = (userData) => {
    setUser(userData);
  };

  /**
   * LOGOUT FONKSIYONU
   * 
   * AKIŞ:
   * 1. authApi.logout ile backend'e istek gönder
   * 2. localStorage'ı temizle
   * 3. State'teki user'ı null yap
   * 4. Kullanıcı login sayfasına yönlendirilmeli (component'te yapılır)
   * 
   * KULLANIM:
   * await logout();
   * navigate("/login");
   */
  const logout = async () => {
    try {
      // API'ye logout isteği gönder
      await logoutApi();
      
      // State'teki kullanıcıyı temizle
      setUser(null);
    } catch (error) {
      // Hata olsa bile kullanıcıyı temizle
      setUser(null);
      throw error;
    }
  };

  /**
   * KULLANICI GİRİŞ YAPMIŞ MI KONTROLÜ
   * 
   * KULLANIM:
   * if (isAuthenticated) {
   *   // Korumalı sayfaya erişim izni ver
   * } else {
   *   // Login sayfasına yönlendir
   * }
   */
  const isAuthenticated = !!user; // user varsa true, yoksa false

  /**
   * CONTEXT VALUE
   * 
   * Bu obje tüm consumer componentlere sağlanır
   * useAuth() hook'u ile erişilebilir
   */
  const value = {
    user,              // Kullanıcı bilgileri
    loading,           // Başlangıç yükleme durumu
    login,             // Login fonksiyonu
    logout,            // Logout fonksiyonu
    setAuthUser,       // Kullanıcıyı direkt set et (register için)
    isAuthenticated,   // Kullanıcı giriş yapmış mı?
  };

  /**
   * İLK YÜKLEME SIRASINDA LOADING GÖSTER
   * 
   * localStorage'dan kullanıcı yüklenirken
   * hiçbir şey render etme
   * 
   * NEDEN?
   * - Kullanıcı varsa korumalı sayfayı göster
   * - Kullanıcı yoksa login'e yönlendir
   * - Bu karar verilene kadar bekle
   */
  if (loading) {
    return (
      <div style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        fontSize: "1.2rem",
        color: "#6b6b84"
      }}>
        Yükleniyor...
      </div>
    );
  }

  /**
   * CONTEXT PROVIDER
   * 
   * value objesi tüm children componentlere sağlanır
   * Herhangi bir component useAuth() ile bu değerlere erişebilir
   */
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth HOOK
 * 
 * BU HOOK NE İŞE YARAR?
 * - AuthContext'e erişmek için kullanılır
 * - Her component'te useContext(AuthContext) yazmak yerine
 *   useAuth() yazmak daha temiz
 * 
 * KULLANIM:
 * const { user, login, logout, setAuthUser, isAuthenticated } = useAuth();
 * 
 * HATA KONTROLÜ:
 * - useAuth sadece AuthProvider içinde kullanılabilir
 * - Dışında kullanılırsa hata fırlatır
 * 
 * ÖRNEK:
 * function Dashboard() {
 *   const { user } = useAuth();
 *   return <h1>Hoş geldin {user.nameSurname}</h1>;
 * }
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === null) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
}