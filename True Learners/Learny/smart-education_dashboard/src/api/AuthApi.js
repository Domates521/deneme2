// src/api/authApi.js
import apiClient from "./client";

/**
 * AUTHENTICATION API SERVICE
 * 
 * Bu dosya, backend'deki /api/auth endpoint'lerine istek gönderir.
 * Login, register ve logout işlemlerini yönetir.
 * 
 * BACKEND ENDPOINT'LER:
 * - POST /api/auth/login    : Kullanıcı girişi
 * - POST /api/auth/register : Yeni kullanıcı kaydı
 * - POST /api/auth/logout   : Kullanıcı çıkışı
 * 
 * TOKEN YÖNETİMİ:
 * - Login başarılıysa token localStorage'a kaydedilir
 * - Her istekte Authorization header'ına eklenir
 * - Logout'ta token silinir
 */

/**
 * Kullanıcı girişi (Login)
 * 
 * AKIŞ:
 * 1. Email ve password ile backend'e POST isteği gönder
 * 2. Backend JWT token döner
 * 3. Token'ı localStorage'a kaydet
 * 4. Kullanıcı bilgilerini döndür
 * 
 * @param {string} email - Kullanıcı email adresi
 * @param {string} password - Kullanıcı şifresi
 * @returns {Promise<Object>} - { token, user, role, message }
 * 
 * ÖRNEK KULLANIM:
 * const response = await login("user@example.com", "123456");
 * // response.token -> JWT token
 * // response.user -> Kullanıcı bilgileri (şifre yok)
 * // response.role -> "Ogretmen" veya "Ogrenci"
 */
export async function login(email, password) {
  try {
    // Backend'e login isteği gönder
    const response = await apiClient.post("/auth/login", {
      email,
      password,
    });

    // Backend'den dönen data:
    // { token, user, role, message }
    const { token, user, role, message } = response.data;

    // Token'ı localStorage'a kaydet
    // Sayfa yenilendiğinde kullanıcı oturumu devam etsin
    if (token) {
      localStorage.setItem("authToken", token);
    }

    // Kullanıcı bilgilerini de kaydedelim (opsiyonel)
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Rol bilgisini de kaydedelim
    if (role) {
      localStorage.setItem("userRole", role);
    }

    return { token, user, role, message };
  } catch (error) {
    // Hata durumunda backend'den gelen mesajı al
    const errorMessage =
      error.response?.data?.error || "Giriş yapılamadı. Lütfen tekrar deneyin.";

    throw new Error(errorMessage);
  }
}

/**
 * Yeni kullanıcı kaydı (Register)
 * 
 * AKIŞ:
 * 1. Kullanıcı bilgileri ile backend'e POST isteği gönder
 * 2. Backend kayıt yapar ve JWT token döner
 * 3. Token'ı localStorage'a kaydet
 * 4. Kullanıcı bilgilerini döndür
 * 
 * @param {Object} userData - Kullanıcı kayıt bilgileri
 * @param {string} userData.userName - Kullanıcı adı (3-50 karakter)
 * @param {string} userData.password - Şifre (min 6 karakter)
 * @param {string} userData.nameSurname - Ad soyad
 * @param {string} userData.mail - Email adresi
 * @param {string} userData.role - "Ogretmen" veya "Ogrenci"
 * @returns {Promise<Object>} - { token, user, role, message }
 * 
 * ÖRNEK KULLANIM:
 * const response = await register({
 *   userName: "yenikullanici",
 *   password: "123456",
 *   nameSurname: "Ahmet Yılmaz",
 *   mail: "ahmet@example.com",
 *   role: "Ogrenci"
 * });
 */
export async function register(userData) {
  try {
    // Backend'e register isteği gönder
    const response = await apiClient.post("/auth/register", userData);

    // Backend'den dönen data
    const { token, user, role, message } = response.data;

    // Token'ı localStorage'a kaydet
    if (token) {
      localStorage.setItem("authToken", token);
    }

    // Kullanıcı bilgilerini kaydet
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    }

    // Rol bilgisini kaydet
    if (role) {
      localStorage.setItem("userRole", role);
    }

    return { token, user, role, message };
  } catch (error) {
    // Hata durumunda backend'den gelen mesajı al
    const errorMessage =
      error.response?.data?.error ||
      "Kayıt yapılamadı. Lütfen bilgilerinizi kontrol edin.";

    throw new Error(errorMessage);
  }
}

/**
 * Kullanıcı çıkışı (Logout)
 * 
 * JWT İLE LOGOUT:
 * - Backend'e istek göndermek opsiyoneldir
 * - Asıl iş: localStorage'dan token'ı silmek
 * - Token silinince kullanıcı authenticated olmaktan çıkar
 * 
 * AKIŞ:
 * 1. localStorage'dan token, user ve role bilgilerini sil
 * 2. Backend'e logout isteği gönder (bilgilendirme amaçlı)
 * 3. Başarı mesajı döndür
 * 
 * @returns {Promise<Object>} - { message }
 * 
 * ÖRNEK KULLANIM:
 * await logout();
 * // Kullanıcı çıkış yapmış olur
 */
export async function logout() {
  try {
    // Backend'e logout isteği gönder
    // Not: JWT ile logout server-side değil, client-side yapılır
    await apiClient.post("/auth/logout");

    // localStorage'dan tüm auth bilgilerini sil
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    return { message: "Çıkış başarılı" };
  } catch (error) {
    // Hata olsa bile localStorage'ı temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    throw new Error("Çıkış yapılırken bir hata oluştu");
  }
}

/**
 * Token'ın geçerliliğini kontrol et
 * 
 * KULLANIM AMACI:
 * - Sayfa yüklendiğinde token'ın hala geçerli olup olmadığını kontrol et
 * - Token süresi dolmuşsa kullanıcıyı logout yap
 * 
 * AKIŞ:
 * 1. localStorage'dan token'ı al
 * 2. Backend'e validate isteği gönder
 * 3. Token geçerliyse true döndür
 * 4. Token geçersizse false döndür ve localStorage'ı temizle
 * 
 * @returns {Promise<boolean>} - Token geçerliyse true
 * 
 * ÖRNEK KULLANIM:
 * const isValid = await validateToken();
 * if (!isValid) {
 *   // Kullanıcıyı login sayfasına yönlendir
 * }
 */
export async function validateToken() {
  try {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return false;
    }

    // Backend'e validate isteği gönder
    // Authorization header'ı apiClient interceptor tarafından eklenir
    await apiClient.get("/auth/validate");

    return true;
  } catch (error) {
    // Token geçersiz - localStorage'ı temizle
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userRole");

    return false;
  }
}

/**
 * localStorage'dan kullanıcı bilgilerini al
 * 
 * KULLANIM AMACI:
 * - Sayfa yüklendiğinde kullanıcı bilgilerini geri yükle
 * - Context'te kullanıcı state'ini initialize et
 * 
 * @returns {Object|null} - Kullanıcı bilgileri veya null
 * 
 * ÖRNEK KULLANIM:
 * const userData = getCurrentUser();
 * if (userData) {
 *   // Kullanıcı oturum açmış
 * }
 */
export function getCurrentUser() {
  try {
    const userStr = localStorage.getItem("user");
    const role = localStorage.getItem("userRole");
    const token = localStorage.getItem("authToken");

    if (userStr && role && token) {
      return {
        ...JSON.parse(userStr),
        role,
        token,
      };
    }

    return null;
  } catch (error) {
    console.error("Kullanıcı bilgileri alınamadı:", error);
    return null;
  }
}