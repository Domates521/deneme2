import React from 'react';
import HoursActivity from './HoursActivity';


const DashboardMain = () => {
  return (
    <>
      {/* Welcome Card */}
      <section className="welcome-card">
        <div className="welcome-bg-shape" />

        <div className="welcome-left">
          <div className="welcome-title">Tekrar hoş geldin, Mehmet!</div>
          <div className="welcome-desc">
            Bu hafta üst üste <strong>4 gün</strong> çalışıyorsun 🎉
            <br />
            Böyle devam et, alışkanlık oluyor!
          </div>
        </div>

        <div className="welcome-illustration">
          <div className="person-illu">💻</div>
        </div>
      </section>

      {/* Stats Row */}
      <section className="stats-row">
        <div className="stat-card">
          <div className="stat-header">
            <span>Dersler</span>
            <div className="stat-icon">📜</div>
          </div>
          <div className="stat-value" id="certCount">
            5
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Sınavlar</span>
            <div className="stat-icon">✅</div>
          </div>
          <div className="stat-value" id="ongoingCount">
            18
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-header">
            <span>Bekleyen Sınavlar</span>
            <div className="stat-icon">📘</div>
          </div>
          <div className="stat-value" id="completedCount">
            6
          </div>
        </div>
      </section>

      {/* Hours Activity (canvas) */}
      <HoursActivity />

      {/* Courses placeholder */}
      <section>
        <div className="section-title">Kurslara Göz At</div>
        <div className="courses-row">
          <p>
            Burada backend&apos;den gelen popüler kurs kartlarını göstereceğiz.
            (React, Spring, UI/UX, Veri Bilimi vb.)
            <br />
            <br />
            <strong>TODO:</strong> Spring Boot API&apos;den
            <code> /api/courses/recommended </code> gibi bir endpoint ile çekip
            burada kartlar halinde listele.
          </p>
        </div>
      </section>
    </>
  );
};

export default DashboardMain;
