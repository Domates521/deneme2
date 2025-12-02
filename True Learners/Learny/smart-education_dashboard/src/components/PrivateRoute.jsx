// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PRIVATE ROUTE COMPONENT
 * 
 * BU COMPONENT NE İŞE YARAR?
 * - Korumalı sayfaları wrap eder
 * - Kullanıcı giriş yapmamışsa login sayfasına yönlendirir
 * - Kullanıcı giriş yapmışsa sayfa içeriğini gösterir
 * 
 * KULLANIM AMACI:
 * - Dashboard, Courses, Profile gibi sayfalar sadece giriş yapan
 *   kullanıcılar tarafından erişilebilir olmalı
 * - Giriş yapmamış kullanıcılar bu sayfalara erişmeye çalışırsa
 *   otomatik olarak login sayfasına yönlendirilir
 * 
 * NASIL ÇALIŞIR?
 * 1. useAuth hook'u ile kullanıcı durumunu kontrol et
 * 2. isAuthenticated true ise -> children'ı render et
 * 3. isAuthenticated false ise -> /login'e yönlendir
 * 
 * ÖRNEK KULLANIM:
 * <Route path="/dashboard" element={
 *   <PrivateRoute>
 *     <Dashboard />
 *   </PrivateRoute>
 * } />
 * 
 * VEYA:
 * <Route path="/courses" element={
 *   <PrivateRoute>
 *     <CoursesPage />
 *   </PrivateRoute>
 * } />
 */

function PrivateRoute({ children }) {
  // AuthContext'ten authentication durumunu al
  const { isAuthenticated, loading } = useAuth();

  /**
   * LOADING DURUMU
   * 
   * NEDEN GEREKLİ?
   * - Sayfa ilk yüklendiğinde AuthContext localStorage'dan
   *   kullanıcı bilgilerini yüklüyor
   * - Bu işlem bitene kadar loading=true
   * - Loading sırasında hiçbir şey render etmemeli
   * 
   * EĞER LOADING KONTROLÜ YAPMAZSAN:
   * - Kullanıcı giriş yapmış olsa bile
   * - İlk render'da user=null olur (henüz yüklenmedi)
   * - isAuthenticated=false döner
   * - Kullanıcı login sayfasına yönlendirilir (YANLIŞ!)
   * 
   * ÇÖZÜM:
   * - Loading bitene kadar bekle
   * - Sonra karar ver: user var mı yok mu?
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
   * AUTHENTICATION KONTROLÜ
   * 
   * AKIŞ:
   * 1. isAuthenticated false ise:
   *    - Navigate component'i ile /login'e yönlendir
   *    - replace={true}: Geri butonuna basınca korumalı sayfaya dönmesin
   * 
   * 2. isAuthenticated true ise:
   *    - children'ı render et (örn: <Dashboard />)
   *    - Kullanıcı sayfayı görebilir
   * 
   * NAVIGATE COMPONENT:
   * - React Router v6'da programmatic navigation için kullanılır
   * - replace={true}: Browser history'den önceki sayfayı siler
   *   (Kullanıcı geri tuşuna basınca korumalı sayfaya dönemez)
   * 
   * ÖRNEK:
   * Kullanıcı giriş yapmadan /dashboard'a gitmeye çalışırsa:
   * /dashboard -> /login (yönlendirilir)
   * Login'den sonra geri tuşu basarsa /dashboard'a gitmez
   */
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default PrivateRoute;