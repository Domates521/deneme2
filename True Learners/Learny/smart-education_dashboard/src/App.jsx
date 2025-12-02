import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import DashboardMain from './components/DashboardMain';
import DashboardSide from './components/DashboardSide';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import PrivateRoute from './components/PrivateRoute';

/**
 * APP COMPONENT - ANA UYGULAMA ROUTE YÖNETİMİ
 * 
 * BU COMPONENT NE YAPAR?
 * - Tüm uygulama route'larını yönetir
 * - Public ve private route'ları ayırır
 * - Authentication durumuna göre yönlendirme yapar
 * 
 * ROUTE YAPISI:
 * 
 * PUBLIC ROUTES (giriş yapmadan erişilebilir):
 * - /login          -> LoginPage
 * - /register       -> RegisterPage
 * 
 * PRIVATE ROUTES (giriş yapmış kullanıcılar için):
 * - /dashboard      -> DashboardPage
 * - /courses        -> CoursesPage
 * - /exam/:examId   -> ExamPage
 * 
 * DEFAULT ROUTE:
 * - /               -> Login'se dashboard'a, değilse login'e yönlendir
 * 
 * NEDEN BÖYLE?
 * - Güvenlik: Private route'lar token olmadan erişilemez
 * - UX: Kullanıcı login'se login sayfasına gitmesin
 * - Mantık: Her route'un net bir amacı var
 */

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* PUBLIC ROUTES - Giriş yapmadan erişilebilir */}
      
      {/* Login Sayfası */}
      <Route 
        path="/login" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        } 
      />
      
      {/* Register Sayfası */}
      <Route 
        path="/register" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <RegisterPage />
        } 
      />

      {/* PRIVATE ROUTES - Giriş yapmış kullanıcılar için */}
      
      {/* Dashboard Sayfası */}
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <DashboardPage />
          </PrivateRoute>
        } 
      />
      
      {/* Courses Sayfası */}
      <Route 
        path="/courses" 
        element={
          <PrivateRoute>
            <CoursesPage />
          </PrivateRoute>
        } 
      />
      
      {/* Exam Sayfası - Dynamic route (examId parametresi ile) */}
      <Route 
        path="/exam/:examId" 
        element={
          <PrivateRoute>
            <ExamPage />
          </PrivateRoute>
        } 
      />

      {/* DEFAULT ROUTE - Ana sayfa yönlendirmesi */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
        } 
      />

      {/* 404 - Bilinmeyen route'lar için */}
      <Route 
        path="*" 
        element={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            fontSize: '1.5rem',
            color: '#6b6b84'
          }}>
            404 - Sayfa Bulunamadı
          </div>
        } 
      />
    </Routes>
  );
};

export default App;