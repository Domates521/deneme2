import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/AuthApi";
import { useAuth } from "../contexts/AuthContext";
import "./RegisterPage.css";

/**
 * REGISTER PAGE COMPONENT
 * 
 * Bu sayfa yeni kullanıcı kaydı için kullanılır.
 * 
 * ÖZELLİKLER:
 * - Kullanıcı adı, şifre, ad soyad, email ve rol seçimi
 * - Şifre tekrarı ile doğrulama
 * - Şifre göster/gizle özelliği
 * - Form validasyonu
 * - Backend ile entegrasyon
 * - Başarılı kayıt sonrası otomatik login ve yönlendirme
 * 
 * FORM ALANLARI:
 * - userName: Kullanıcı adı (3-50 karakter)
 * - nameSurname: Ad Soyad
 * - mail: Email adresi
 * - password: Şifre (min 6 karakter)
 * - confirmPassword: Şifre tekrarı (frontend validasyonu)
 * - role: Öğretmen veya Öğrenci
 */
const RegisterPage = () => {
  const navigate = useNavigate();
  const { setAuthUser } = useAuth();

  // Form state'i
  const [form, setForm] = useState({
    userName: "",
    nameSurname: "",
    mail: "",
    password: "",
    confirmPassword: "",
    role: "", // "Ogretmen" veya "Ogrenci"
  });

  // UI state'leri
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /**
   * Form input değişikliklerini yönet
   * Her input değiştiğinde ilgili state güncellenir
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Kullanıcı yazmaya başladığında error mesajını temizle
    setError("");
  };

  /**
   * Şifre görünürlüğünü değiştir
   */
  const togglePassword = () => setShowPassword((prev) => !prev);
  const toggleConfirmPassword = () => setShowConfirmPassword((prev) => !prev);

  /**
   * Form validasyonu
   * Frontend'de temel kontrolleri yapar
   * 
   * KONTROLLER:
   * 1. Tüm alanlar dolu mu?
   * 2. Email formatı geçerli mi?
   * 3. Kullanıcı adı uzunluğu uygun mu?
   * 4. Şifre minimum 6 karakter mi?
   * 5. Şifreler eşleşiyor mu?
   * 6. Rol seçilmiş mi?
   */
  const validateForm = () => {
    // Boş alan kontrolü
    if (!form.userName.trim()) {
      setError("Kullanıcı adı boş bırakılamaz");
      return false;
    }

    if (!form.nameSurname.trim()) {
      setError("Ad soyad boş bırakılamaz");
      return false;
    }

    if (!form.mail.trim()) {
      setError("Email boş bırakılamaz");
      return false;
    }

    if (!form.password.trim()) {
      setError("Şifre boş bırakılamaz");
      return false;
    }

    if (!form.confirmPassword.trim()) {
      setError("Şifre tekrarını giriniz");
      return false;
    }

    if (!form.role) {
      setError("Lütfen bir rol seçiniz");
      return false;
    }

    // Kullanıcı adı uzunluk kontrolü
    if (form.userName.length < 3 || form.userName.length > 50) {
      setError("Kullanıcı adı 3-50 karakter arasında olmalı");
      return false;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.mail)) {
      setError("Geçerli bir email adresi giriniz");
      return false;
    }

    // Şifre uzunluk kontrolü
    if (form.password.length < 6) {
      setError("Şifre en az 6 karakter olmalı");
      return false;
    }

    // Şifre eşleşme kontrolü
    if (form.password !== form.confirmPassword) {
      setError("Şifreler eşleşmiyor");
      return false;
    }

    return true;
  };

  /**
   * Form submit işlemi
   * 
   * AKIŞ:
   * 1. Form validasyonunu yap
   * 2. Backend'e kayıt isteği gönder
   * 3. Başarılı kayıt sonrası AuthContext'i güncelle
   * 4. Kullanıcıyı dashboard'a yönlendir
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Frontend validasyon
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend'e kayıt isteği gönder
      // confirmPassword backend'e gönderilmez (sadece frontend validasyonu)
      const { confirmPassword, ...registerData } = form;
      
      const response = await register(registerData);

      // Başarılı kayıt - AuthContext'i güncelle
      // setAuthUser kullanıcı bilgilerini state'e kaydeder
      setAuthUser(response.user);

      // Kullanıcıyı dashboard'a yönlendir
      navigate("/dashboard");
    } catch (err) {
      // Hata mesajını göster
      setError(err.message || "Kayıt yapılırken bir hata oluştu");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Login sayfasına git
   */
  const handleGoToLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };

  return (
    <div className="register-page">
      <div className="register-wrapper">
        <section className="register-left">
          {/* Brand */}
          <div className="brand-header">
            <div className="brand-icon">✏️</div>
            <div className="brand-text">
              <div className="title">smart education</div>
              <div className="subtitle">your best slogan here</div>
            </div>
          </div>

          {/* Welcome text */}
          <div className="welcome-block">
            <div className="welcome-title">Yeni hesap oluştur 🚀</div>
            <div className="welcome-desc">
              Learny'ye katıl ve öğrenme yolculuğuna başla!
            </div>
          </div>

          {/* FORM CARD */}
          <div className="form-card">
            {error && <div className="error-box">{error}</div>}

            <form onSubmit={handleSubmit} noValidate>
              {/* Kullanıcı Adı */}
              <div className="form-row">
                <label className="form-label" htmlFor="userNameInput">
                  <span>Kullanıcı Adı</span>
                  <span className="hint">(3-50 karakter)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="userNameInput"
                    name="userName"
                    type="text"
                    placeholder="kullaniciadi"
                    autoComplete="username"
                    required
                    value={form.userName}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Ad Soyad */}
              <div className="form-row">
                <label className="form-label" htmlFor="nameSurnameInput">
                  <span>Ad Soyad</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="nameSurnameInput"
                    name="nameSurname"
                    type="text"
                    placeholder="Ahmet Yılmaz"
                    autoComplete="name"
                    required
                    value={form.nameSurname}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Email */}
              <div className="form-row">
                <label className="form-label" htmlFor="emailInput">
                  <span>E-posta Adresi</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="emailInput"
                    name="mail"
                    type="email"
                    placeholder="ornek@site.com"
                    autoComplete="email"
                    required
                    value={form.mail}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Şifre */}
              <div className="form-row">
                <label className="form-label" htmlFor="passwordInput">
                  <span>Şifre</span>
                  <span className="hint">(min 6 karakter)</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="passwordInput"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={togglePassword}
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showPassword ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              {/* Şifre Tekrar */}
              <div className="form-row">
                <label className="form-label" htmlFor="confirmPasswordInput">
                  <span>Şifre Tekrar</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="confirmPasswordInput"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    required
                    value={form.confirmPassword}
                    onChange={handleChange}
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={toggleConfirmPassword}
                    aria-label="Şifreyi göster/gizle"
                  >
                    {showConfirmPassword ? "Gizle" : "Göster"}
                  </button>
                </div>
              </div>

              {/* Rol Seçimi */}
              <div className="form-row">
                <label className="form-label" htmlFor="roleSelect">
                  <span>Rolünüzü Seçin</span>
                </label>
                <div className="input-wrapper">
                  <select
                    className="input-field select-field"
                    id="roleSelect"
                    name="role"
                    required
                    value={form.role}
                    onChange={handleChange}
                  >
                    <option value="">Seçiniz...</option>
                    <option value="Ogrenci">Öğrenci</option>
                    <option value="Ogretmen">Öğretmen</option>
                  </select>
                </div>
              </div>

              {/* Submit Button */}
              <button
                className="register-btn"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? "Kaydediliyor..." : "Hesap Oluştur"}</span>
              </button>
            </form>

            <div className="divider-row">veya</div>

            <div className="social-row">
              <button className="social-btn" type="button">
                <span>📱</span>
                <span>Google ile kaydol</span>
              </button>
              <button className="social-btn" type="button">
                <span>💼</span>
                <span>GitHub ile kaydol</span>
              </button>
            </div>

            <div className="login-row">
              Zaten hesabın var mı?{" "}
              <a href="#" onClick={handleGoToLogin}>
                Giriş yap
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RegisterPage;