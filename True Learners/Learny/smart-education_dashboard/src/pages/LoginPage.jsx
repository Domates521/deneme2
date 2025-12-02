// src/pages/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./LoginPage.css";

/**
 * LOGIN PAGE COMPONENT
 * 
 * Backend ile entegre login sayfası
 * 
 * AKIŞ:
 * 1. Kullanıcı email ve şifre girer
 * 2. Form submit edilir
 * 3. AuthContext.login() çağrılır
 * 4. Backend'e /api/auth/login isteği gönderilir
 * 5. Başarılı ise token localStorage'a kaydedilir
 * 6. Kullanıcı dashboard'a yönlendirilir
 */
const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [form, setForm] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  /**
   * Form Submit İşlemi
   * 
   * AKIŞ:
   * 1. Boş alan kontrolü yap
   * 2. Loading state'i aktif et
   * 3. AuthContext.login() ile backend'e istek gönder
   * 4. Başarılı ise dashboard'a yönlendir
   * 5. Hata varsa error state'e kaydet
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Boş alan kontrolü
    if (!form.email.trim() || !form.password.trim()) {
      setError("Lütfen e-posta ve şifre alanlarını doldurun.");
      return;
    }

    // Email format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError("Geçerli bir e-posta adresi giriniz.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // AuthContext üzerinden login işlemi
      await login(form.email, form.password);
      
      // Başarılı giriş - dashboard'a yönlendir
      navigate("/dashboard");
    } catch (err) {
      // Hata mesajını göster
      console.error("Login hatası:", err);
      setError(err.message || "Giriş yapılamadı. Lütfen tekrar deneyin.");
    } finally {
      setLoading(false);
    }
  };

  const togglePassword = () => setShowPassword((prev) => !prev);

  // Kayıt sayfasına yönlendirme
  const handleGoToRegister = (e) => {
    e.preventDefault();
    navigate("/register");
  };

  return (
    <div className="login-page">
      <div className="login-wrapper">
        {/* LEFT SIDE: FORM */}
        <section className="login-left">
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
            <div className="welcome-title">Tekrar hoş geldin 👋</div>
            <div className="welcome-desc">
              Hesabına giriş yap ve kaldığın yerden devam et.
            </div>
          </div>

          {/* FORM CARD */}
          <div className="form-card">
            {error && (
              <div className="error-box">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <label className="form-label" htmlFor="emailInput">
                  <span>E-posta adresi</span>
                </label>
                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="emailInput"
                    name="email"
                    type="email"
                    placeholder="ornek@site.com"
                    autoComplete="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="form-row">
                <label className="form-label" htmlFor="passwordInput">
                  <span>Şifre</span>
                  <a className="forgot-link" href="#">
                    Şifremi unuttum
                  </a>
                </label>

                <div className="input-wrapper">
                  <input
                    className="input-field"
                    id="passwordInput"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                    value={form.password}
                    onChange={handleChange}
                    disabled={loading}
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

              <div className="remember-row">
                <label className="remember-left">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={form.rememberMe}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <span>Beni hatırla</span>
                </label>

                <span
                  style={{
                    color: "var(--text-light)",
                    fontSize: ".7rem",
                  }}
                >
                  Misafir giriş aktif değil
                </span>
              </div>

              <button 
                className="login-btn" 
                type="submit"
                disabled={loading}
                style={{ opacity: loading ? 0.7 : 1 }}
              >
                {loading ? (
                  <span>Giriş yapılıyor...</span>
                ) : (
                  <span>Giriş Yap</span>
                )}
              </button>
            </form>

            <div className="divider-row">veya</div>

            <div className="social-row">
              <button className="social-btn" type="button" disabled={loading}>
                <span>📱</span>
                <span>Google ile devam et</span>
              </button>
              <button className="social-btn" type="button" disabled={loading}>
                <span>💼</span>
                <span>GitHub ile devam et</span>
              </button>
            </div>

            <div className="signup-row">
              Hesabın yok mu?{" "}
              <a href="#" onClick={handleGoToRegister}>
                Kayıt ol
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default LoginPage;
