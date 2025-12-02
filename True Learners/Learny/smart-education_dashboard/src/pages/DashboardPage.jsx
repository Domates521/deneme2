// src/pages/DashboardPage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import DashboardMain from '../components/DashboardMain';
import DashboardSide from '../components/DashboardSide';

/**
 * DASHBOARD PAGE
 * 
 * BU SAYFA NE YAPAR?
 * - Kullanıcının ana kontrol paneli
 * - Sidebar, Topbar ve dashboard içeriğini gösterir
 * - Korumalı bir sayfadır (PrivateRoute ile wrap edilmiş)
 * 
 * BİLEŞENLER:
 * - Sidebar: Sol menü (Dashboard, Derslerim, Sınavlar, vb.)
 * - Topbar: Üst bar (Arama, bildirimler, kullanıcı bilgisi)
 * - DashboardMain: Ana içerik (İstatistikler, grafikler)
 * - DashboardSide: Sağ panel (Takvim, görevler)
 * 
 * AUTHENTICATION:
 * - useAuth hook'u ile kullanıcı bilgilerine erişilir
 * - Logout işlemi yapılabilir
 * - Kullanıcı adı, rol gibi bilgiler gösterilebilir
 * 
 * NAVIGATION:
 * - useNavigate hook'u ile sayfa yönlendirmeleri yapılır
 * - Sidebar'dan menü tıklandığında ilgili sayfaya gidilir
 * - Logout sonrası /login'e yönlendirilir
 */

function DashboardPage() {
  // Authentication bilgilerine erişim
  const { user, logout } = useAuth();
  
  // Sayfa yönlendirmeleri için
  const navigate = useNavigate();

  /**
   * LOGOUT İŞLEMİ
   * 
   * AKIŞ:
   * 1. logout() fonksiyonunu çağır
   * 2. localStorage temizlenir
   * 3. user state'i null olur
   * 4. /login sayfasına yönlendir
   * 
   * KULLANIM:
   * Topbar'da veya Sidebar'da "Çıkış Yap" butonu
   * tıklandığında bu fonksiyon çağrılır
   */
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Çıkış hatası:', error);
      // Hata olsa bile login'e yönlendir
      navigate('/login');
    }
  };

  /**
   * SAYFA NAVİGASYONU
   * 
   * Sidebar'dan menü öğelerine tıklandığında
   * ilgili sayfaya yönlendirme yapar
   * 
   * ÖRNEK:
   * handleNavigate('courses') -> /courses sayfasına git
   * handleNavigate('exams') -> /exams sayfasına git
   */
  const handleNavigate = (page) => {
    navigate(`/${page}`);
  };

  return (
    <div className="layout">
      {/* 
        SIDEBAR
        
        Sol menü - sayfalar arası geçiş
        
        Props:
        - onNavigate: Menü öğesine tıklandığında çağrılır
        - onLogout: Çıkış yap butonuna tıklandığında çağrılır
        - currentPage: Hangi sayfada olduğumuzu gösterir (active class için)
        
        NOT: Sidebar component'i bu prop'ları alacak şekilde
        güncellenmelidir (ileride)
      */}
      <Sidebar 
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        currentPage="dashboard"
      />

      <main className="main-area">
        {/* 
          TOPBAR
          
          Üst bar - arama, bildirimler, kullanıcı bilgisi
          
          Props:
          - user: Kullanıcı bilgileri (ad, rol)
          - onLogout: Çıkış yap butonuna tıklandığında
          
          NOT: Topbar component'i user prop'unu alacak şekilde
          güncellenmelidir
        */}
        <Topbar 
          user={user}
          onLogout={handleLogout}
        />

        {/* 
          DASHBOARD İÇERİĞİ
          
          Ana içerik ve yan panel
          
          DashboardMain:
          - Hoşgeldin kartı
          - İstatistikler (Dersler, Sınavlar, Bekleyen Sınavlar)
          - Sınav geçmişi grafiği
          - Kurslar
          
          DashboardSide:
          - Takvim
          - Bugünkü görevler
          - Yaklaşan etkinlikler
        */}
        <div className="dashboard-columns">
          <section className="dashboard-main">
            <DashboardMain user={user} />
          </section>

          <aside className="dashboard-side">
            <DashboardSide user={user} />
          </aside>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;

/**
 * SIDEBAR VE TOPBAR GÜNCELLEMELERİ
 * 
 * Bu component'ler henüz navigation prop'larını almıyor.
 * İleride şu güncellemeler yapılmalı:
 * 
 * 1. SIDEBAR.JSX:
 *    - props: { onNavigate, onLogout, currentPage }
 *    - Menü öğelerine onClick ekle
 *    - onClick={() => onNavigate('courses')}
 *    - Logout butonu: onClick={onLogout}
 *    - currentPage'e göre active class ekle
 * 
 * 2. TOPBAR.JSX:
 *    - props: { user, onLogout }
 *    - Kullanıcı bilgilerini göster (user.nameSurname, user.role)
 *    - Dropdown menüye logout butonu ekle
 *    - onClick={onLogout}
 * 
 * 3. DASHBOARDMAIN.JSX:
 *    - props: { user }
 *    - "Tekrar hoş geldin, {user.nameSurname}" gibi
 *    - Backend'den kullanıcıya özel istatistikler çek
 * 
 * ÖRNEK SİDEBAR GÜNCELLEMESİ:
 * 
 * function Sidebar({ onNavigate, onLogout, currentPage }) {
 *   return (
 *     <aside className="sidebar">
 *       // ... brand ...
 *       <nav className="sidebar-nav">
 *         <ul className="nav-list">
 *           <li className="nav-item">
 *             <a 
 *               className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
 *               onClick={() => onNavigate('dashboard')}
 *             >
 *               Dashboard
 *             </a>
 *           </li>
 *           <li className="nav-item">
 *             <a 
 *               className={`nav-link ${currentPage === 'courses' ? 'active' : ''}`}
 *               onClick={() => onNavigate('courses')}
 *             >
 *               Derslerim
 *             </a>
 *           </li>
 *           // ... diğer menü öğeleri ...
 *           <li className="nav-item">
 *             <a className="nav-link" onClick={onLogout}>
 *               Çıkış Yap
 *             </a>
 *           </li>
 *         </ul>
 *       </nav>
 *     </aside>
 *   );
 * }
 */