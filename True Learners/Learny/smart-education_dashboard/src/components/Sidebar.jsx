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
  const availableRoutes = ['dashboard', 'courses'];
  
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
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                <path d="M4 4h16v16H6.5A2.5 2.5 0 0 0 4 22z" />
              </svg>
              <span>Derslerim</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'exams')}>
              <svg 
                fill="currentColor"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm2 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
              </svg>
              <span>Sınavlar</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'calendar')}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Takvim / Program</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'messages')}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Mesajlar</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'achievements')}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M8 21h8" />
                <path d="M12 17v4" />
                <path d="M7 4h10v4a5 5 0 0 1-10 0z" />
                <path d="M5 4h2v2a3 3 0 0 1-3 3H3V7a3 3 0 0 1 2-3zM19 4a3 3 0 0 1 2 3v2h-1a3 3 0 0 1-3-3V4z" />
              </svg>
              <span>Başarılar</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'community')}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              <span>Topluluk</span>
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="#" onClick={(e) => handleNavClick(e, 'settings')}>
              <svg
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15 1.65 1.65 0 0 0 3.09 14H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09A1.65 1.65 0 0 0 19.4 15z" />
              </svg>
              <span>Ayarlar</span>
            </a>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;