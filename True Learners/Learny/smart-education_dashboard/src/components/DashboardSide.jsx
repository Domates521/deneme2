import React, { useState } from 'react';

const DashboardSide = () => {
  const daysShort = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'];

  // Şubat 2023 sabit örnek (HTML'deki ile aynı)
  const meta = {
    name: 'Şubat 2023',
    firstWeekday: 3, // 0=Paz ... 3=Çar
    daysInMonth: 28,
    today: 15,
  };
  
  const [selectedDay, setSelectedDay] = useState(meta.today);

  const blankDays = Array.from({ length: meta.firstWeekday });

  const handlePrevMonth = () => {
    // İleride burada backend'den veri çekebilirsin
    // örn: setMonthState(...) + fetch('/api/calendar?month=...')
    alert('TODO: önceki aya git (Spring Boot\'tan etkinlikleri çek)');
  };

  const handleNextMonth = () => {
    alert('TODO: sonraki aya git (Spring Boot\'tan etkinlikleri çek)');
  };

  return (
    <>
      {/* Calendar / Tasks */}
      <section className="side-card">
        <div className="calendar-head">
          <div className="calendar-head-left">
            <div className="calendar-title">Takvim</div>
            <div className="calendar-month">
              <div className="calendar-nav-btn" onClick={handlePrevMonth}>
                &lt;
              </div>
              <span id="calendarMonthLabel">{meta.name}</span>
              <div className="calendar-nav-btn" onClick={handleNextMonth}>
                &gt;
              </div>
            </div>
          </div>
          <div
            className="see-all"
            style={{ alignSelf: 'flex-start' }}
          >
            Tümünü Gör
          </div>
        </div>

        <div className="calendar-days-grid" id="calendarGrid">
          {daysShort.map((d) => (
            <div key={d} className="day-name">
              {d}
            </div>
          ))}

          {blankDays.map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="calendar-day"
              style={{ visibility: 'hidden' }}
            />
          ))}

          {Array.from({ length: meta.daysInMonth }).map((_, idx) => {
            const day = idx + 1;
            const isToday = day === meta.today;
            const isSelected = day === selectedDay;

            return (
                <div
                key={day}
                className={`calendar-day ${isToday ? 'today' : ''} ${isSelected ? 'selected-day' : ''}`}
                onClick={() => setSelectedDay(day)}   // 🔹 tıklanınca seçili günü güncelle
                >
                {day}
                </div>
            );
            })}
        </div>

        <div className="tasks-title-row">
          <span>Bugünkü Görevler</span>
          <span className="tasks-more">Daha Fazla</span>
        </div>

        <div className="task-list">
          <div className="task-item highlight">
            <div className="task-text">Matematik - Problemler</div>
            <div className="task-chevron">›</div>
          </div>
          <div className="task-item">
            <div className="task-text">Türkçe - Ölü Ozanlar Derneği</div>
            <div className="task-chevron">›</div>
          </div>
          <div className="task-item">
            <div className="task-text">Matematik - Trigonometri</div>
            <div className="task-chevron">›</div>
          </div>
        </div>
      </section>

      {/* Events */}
      <section className="side-card">
        <div className="events-head">
          <div className="events-title">Yaklaşan Etkinlikler</div>
          <div className="see-all">Tümünü Gör</div>
        </div>

        <div className="event-card" style={{ marginBottom: '1rem' }}>
          <div className="event-date">
            <div className="day-num">13</div>
            <div className="weekday">Pzt</div>
          </div>
          <div className="event-body">
            <div className="event-body-title">Matematik - Yazılı 1</div>
            <div className="event-time">15:00 - 16:00</div>
            <div className="event-cta">Şimdi Kaydol</div>
          </div>
        </div>

        <div className="event-card">
          <div className="event-date">
            <div className="day-num">22</div>
            <div className="weekday">Çar</div>
          </div>
          <div className="event-body">
            <div className="event-body-title">Türkçe - Şiir Yarışması</div>
            <div className="event-time">14:00 - 18:00</div>
            <div className="event-cta">Takvime Ekle</div>
          </div>
        </div>
      </section>
    </>
  );
};

export default DashboardSide;
