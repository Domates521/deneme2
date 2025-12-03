// src/components/Sidebar.jsx
import React from 'react';

/**
 * SIDEBAR COMPONENT
 * 
 * Props:
 * - onNavigate: Menü öğesine tıklandığında sayfa geçişi yapar
 * - onLogout: Çıkış yap butonuna tıklandığında çağrılır
 * - currentPage: Hangi sayfada olduğumuzu gösterir (active class için)
 */
const Sidebar = ({ onNavigate, onLogout, currentPage = 'dashboard' }) => {
  
  // Tanımlı route'lar - bunlar App.jsx'de var
  const availableRoutes = ['dashboard', 'courses', 'exams'];
  
  const handleNavClick = (event, page) => {
    event.preventDefault();
    
    // Eğer route tanımlıysa git
    if (availableRoutes.includes(page)) {
      if (onNavigate) {
        onNavigate(page);
      }
    } else {
      // Henüz hazır değilse bilgilendir
      alert(`"${page}" sayfası henüz hazır değil. Yakında eklenecek! 🚀`);
    }
  };

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon">✏️</div>
        <div className="brand-text">
          <div className="title">
            smart
            <br />
            education
          </div>
          <div className="subtitle">your best slogan here</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <div className="sidebar-section-label">Main</div>
        <ul className="nav-list">
          <li className="nav-item">
            <a 
              className={`nav-link ${currentPage === 'dashboard' ? 'active' : ''}`}
              href="#" 
              onClick={(e) => handleNavClick(e, 'dashboard')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M3 13h8V3H3zM13 21h8v-8h-8zM13 3v8h8V3zM3 21h8v-4H3z" />
              </svg>
              <span>Dashboard</span>
            </a>
          </li>

          <li className="nav-item">
            <a 
              className={`nav-link ${currentPage === 'courses' ? 'active' : ''}`}
              href="#" 
              onClick={(e) => handleNavClick(e, 'courses')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20M4 19.5A2.5 2.5 0 004 22h16v-7H6.5A2.5 2.5 0 004 17.5v2z" />
                <path d="M4 4.5A2.5 2.5 0 016.5 2H20v15H6.5A2.5 2.5 0 014 14.5v-10z" />
              </svg>
              <span>Derslerim</span>
            </a>
          </li>

          {/* SINAVLAR - YENİ EKLENEN */}
          <li className="nav-item">
            <a 
              className={`nav-link ${currentPage === 'exams' ? 'active' : ''}`}
              href="#" 
              onClick={(e) => handleNavClick(e, 'exams')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 11l3 3L22 4" />
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
              </svg>
              <span>Sınavlar</span>
            </a>
          </li>

          <li className="nav-item">
            <a 
              className="nav-link" 
              href="#" 
              onClick={(e) => handleNavClick(e, 'schedule')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path d="M16 2v4M8 2v4M3 10h18" />
              </svg>
              <span>Takvim</span>
            </a>
          </li>
        </ul>

        <div className="sidebar-section-label">Support</div>
        <ul className="nav-list">
          <li className="nav-item">
            <a 
              className="nav-link" 
              href="#" 
              onClick={(e) => handleNavClick(e, 'help')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3M12 17h.01" />
              </svg>
              <span>Yardım</span>
            </a>
          </li>

          <li className="nav-item">
            <a 
              className="nav-link" 
              href="#" 
              onClick={(e) => handleNavClick(e, 'settings')}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z" />
              </svg>
              <span>Ayarlar</span>
            </a>
          </li>
          
          {/* Çıkış Yap Butonu */}
          <li className="nav-item">
            <a 
              className="nav-link" 
              href="#" 
              onClick={(e) => {
                e.preventDefault();
                if (onLogout) onLogout();
              }}
            >
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
              </svg>
              <span>Çıkış Yap</span>
            </a>
          </li>
        </ul>
      </nav>

      <div className="upgrade-card">
        <h3>
          Upgrade to <span className="pro-badge">PRO</span>
        </h3>
        <p>Tüm özelliklere sınırsız erişim!</p>
        <button className="upgrade-btn">Upgrade Planı</button>
        <div className="upgrade-illustration" />
      </div>
    </aside>
  );
};

export default Sidebar;
