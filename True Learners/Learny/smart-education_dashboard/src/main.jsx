import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import './styles.css'
import App from './App.jsx'

/**
 * MAIN.JSX - UYGULAMA GİRİŞ NOKTASI
 * 
 * BU DOSYA NE YAPAR?
 * - React uygulamasını DOM'a bağlar
 * - Global provider'ları wrap eder
 * - Routing sistemini başlatır
 * 
 * WRAPPER SIRASI (dıştan içe):
 * 1. StrictMode: React geliştirme uyarıları için
 * 2. BrowserRouter: React Router için
 * 3. AuthProvider: Authentication state yönetimi için
 * 4. App: Ana uygulama componenti
 * 
 * NEDEN BU SIRA?
 * - BrowserRouter en dışta olmalı (routing her yerde geçerli)
 * - AuthProvider Router'ın içinde (navigation kullanabilmesi için)
 * - App en içte (tüm provider'lara erişebilir)
 */

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);