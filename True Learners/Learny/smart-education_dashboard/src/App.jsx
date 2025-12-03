// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CoursesPage from './pages/CoursesPage';
import DashboardPage from './pages/DashboardPage';
import ExamPage from './pages/ExamPage';
import ExamsPage from './pages/ExamsPage';
import ExamCreatePage from './pages/ExamCreatePage';
import ExamResultPage from './pages/ExamResultPage';
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
 * - /exams          -> ExamsPage (Sınav listesi)
 * - /exam/create    -> ExamCreatePage (Sınav oluşturma - öğretmen)
 * - /exam/:examId   -> ExamPage (Sınav çözme)
 * - /exam-result/:resultId -> ExamResultPage (Sınav sonucu)
 * 
 * DEFAULT ROUTE:
 * - /               -> Login'se dashboard'a, değilse login'e yönlendir
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
      
      {/* ===== SINAV ROUTE'LARI ===== */}
      
      {/* Sınavlar Listesi Sayfası */}
      <Route 
        path="/exams" 
        element={
          <PrivateRoute>
            <ExamsPage />
          </PrivateRoute>
        } 
      />
      
      {/* Sınav Oluşturma Sayfası (Öğretmenler için) */}
      <Route 
        path="/exam/create" 
        element={
          <PrivateRoute>
            <ExamCreatePage />
          </PrivateRoute>
        } 
      />
      
      {/* Sınav Çözme Sayfası - Dynamic route (examId parametresi ile) */}
      <Route 
        path="/exam/:examId" 
        element={
          <PrivateRoute>
            <ExamPage />
          </PrivateRoute>
        } 
      />
      
      {/* Sınav Sonuç Sayfası */}
      <Route 
        path="/exam-result/:resultId" 
        element={
          <PrivateRoute>
            <ExamResultPage />
          </PrivateRoute>
        } 
      />

      {/* DEFAULT ROUTE - Ana sayfa yönlendirmesi */}
      <Route 
        path="/" 
        element={
          isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Navigate to="/login" replace />
        } 
      />

      {/* 404 - Bulunamayan sayfalar */}
      <Route 
        path="*" 
        element={
          <Navigate to="/" replace />
        } 
      />
    </Routes>
  );
};

export default App;
