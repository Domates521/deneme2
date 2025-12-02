import React, { useEffect, useRef, useState } from 'react';
import { getAllEnrollments } from '../api/enrollmentApi';
import { getAllCourses } from '../api/courseApi';

const HoursActivity = () => {
  const canvasRef = useRef(null);

  // 🔹 Seçenek listesi
  // 🔹 Seçenek listesi (artık state)
  const [activityOptions, setActivityOptions] = useState(['Hepsi']);
  const [selectedActivity, setSelectedActivity] = useState('Hepsi');

  useEffect(() => {
    const fetchUserCourses = async () => {
      try {
        // --- 1) Tüm enrollments'ı çek
        const allEnrollments = await getAllEnrollments();
        // Beklenen örnek JSON (backend'ine göre değişebilir):
        // [
        //   { id: 10, studentId: 1, courseId: 3, ... },
        //   { id: 11, studentId: 1, courseId: 5, ... },
        //   { id: 12, studentId: 2, courseId: 3, ... },
        //   ...
        // ]

        // --- 2) Sadece studentId = 1 olanları filtrele
        const studentId = 6; // Şimdilik sabit; giriş yapan kullanıcının id'si ile değiştirebilirsin
        const userEnrollments = allEnrollments.filter(
          (enrollment) => enrollment.student.id === studentId
          // eğer backend'te alan adı farklaysa:
          // (enrollment) => enrollment.ogrenciId === studentId
        );

        if (userEnrollments.length === 0) {
          console.warn('Bu öğrenci için enrollment bulunamadı');
          return;
        }

        // --- 3) Bu enrollments içinden courseId'leri al
        const courseIds = userEnrollments.map((enrollment) => enrollment.course.id);
        // (eğer alan kursId / dersId vs ise yukarıyı değiştir)

        // Tekrar eden courseId'leri temizle (aynı derse birden fazla kayıt varsa)
        const uniqueCourseIds = Array.from(new Set(courseIds));

        // --- 4) Tüm kursları çek
        const allCourses = await getAllCourses();
        // Örnek JSON:
        // [
        //   { id: 3, courseName: "Matematik", ... },
        //   { id: 5, courseName: "Türkçe", ... },
        //   { id: 7, courseName: "Fen Bilimleri", ... },
        //   ...
        // ]

        // --- 5) uniqueCourseIds içinde olan dersleri filtrele
        const userCourses = allCourses.filter((course) =>
          uniqueCourseIds.includes(course.id)
          // Eğer kurs tablosunda id yerine courseId/dersId kullanıyorsan burayı değiştir
        );

        if (userCourses.length === 0) {
          console.warn('Öğrencinin kayıtlı olduğu courseId’lere sahip ders bulunamadı');
          return;
        }

        // --- 6) Bu derslerin isimlerini al
        const courseNames = userCourses
          .map((course) => course.code) // backend'e göre courseName / name
          .filter((code) => !!code); // boş/null olanları at

        const uniqueCourseNames = Array.from(new Set(courseNames));

        // --- 7) "Hepsi" + ders adları → select options
        setActivityOptions(['Hepsi', ...uniqueCourseNames]);
        setSelectedActivity('Hepsi');
      } catch (error) {
        console.error('Kullanıcının dersleri yüklenirken hata oluştu:', error);
      }
    };

    fetchUserCourses();
  }, []); // component ilk yüklendiğinde 1 kez çalışsın

  useEffect(() => {
    const days = ['08', '09', '10', '11', '12', '13', '14'];
    const yellowData = [3, 2.5, 1, 2, 4, 0.8, 5];
    const purpleData = [2, 3.2, 0, 3.5, 5, 4.2, 3.1];

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // roundRect polyfill
    if (!CanvasRenderingContext2D.prototype.roundRect) {
      // eslint-disable-next-line no-extend-native
      CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        if (w < 2 * r) r = w / 2;
        if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x + r, y);
        this.arcTo(x + w, y, x + w, y + h, r);
        this.arcTo(x + w, y + h, x, y + h, r);
        this.arcTo(x, y + h, x, y, r);
        this.arcTo(x, y, x + w, y, r);
        this.closePath();
        return this;
      };
    }

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const paddingLeft = 35;
      const paddingBottom = 25;
      const chartW = w - paddingLeft - 10;
      const chartH = h - paddingBottom - 20;

      const maxVal = Math.max(...yellowData, ...purpleData, 6);
      const groupWidth = chartW / days.length;
      const barWidth = groupWidth * 0.3;
      const gapBetweenBars = groupWidth * 0.1;

      ctx.font = '11px Poppins, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // grid & y labels
      ctx.strokeStyle = '#e5e7ef';
      ctx.lineWidth = 1;
      const steps = 5;
      for (let i = 0; i <= steps; i += 1) {
        const yVal = (maxVal / steps) * i;
        const y = h - paddingBottom - (yVal / maxVal) * chartH;
        ctx.beginPath();
        ctx.moveTo(paddingLeft, y);
        ctx.lineTo(paddingLeft + chartW, y);
        ctx.stroke();

        ctx.fillStyle = '#6b6b84';
        ctx.textAlign = 'right';
        ctx.fillText(`${yVal.toFixed(0)}h`, paddingLeft - 6, y);
      }

      // bars
      for (let i = 0; i < days.length; i += 1) {
        const gx = paddingLeft + i * groupWidth + groupWidth * 0.5;

        const yValYellow = yellowData[i];
        const barYellowH = (yValYellow / maxVal) * chartH;
        const yYellowTop = h - paddingBottom - barYellowH;

        const yValPurple = purpleData[i];
        const barPurpleH = (yValPurple / maxVal) * chartH;
        const yPurpleTop = h - paddingBottom - barPurpleH;

        // yellow
        ctx.fillStyle = '#f5c84c';
        ctx.beginPath();
        ctx.roundRect(
          gx - barWidth - gapBetweenBars / 2,
          yYellowTop,
          barWidth,
          barYellowH,
          4
        );
        ctx.fill();

        // purple
        ctx.fillStyle = '#5d3bea';
        ctx.beginPath();
        ctx.roundRect(
          gx + gapBetweenBars / 2,
          yPurpleTop,
          barWidth,
          barPurpleH,
          4
        );
        ctx.fill();

        // x label
        ctx.fillStyle = '#6b6b84';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.fillText(days[i], gx, h - paddingBottom + 5);
      }
    };

    const resizeCanvas = () => {
      const containerWidth = canvas.parentElement.clientWidth;
      const width = Math.max(400, Math.min(600, containerWidth));
      const height = 200;
      canvas.width = width;
      canvas.height = height;
      draw();
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // 🔹 Seçim değişince ne olacağını burada kontrol edebilirsin
  const handleActivityChange = (e) => {
    const value = e.target.value;
    setSelectedActivity(value);
    console.log('Seçilen aktivite:', value);
    // İleride: buradan grafikte gösterilen veriyi filtreleyebilirsin
  };

  return (
    <section className="panel-card">
      <div className="panel-head">
        <div className="panel-head-left">
          <div className="panel-title">
            Sınav Geçmişi
            <span
              style={{
                fontSize: '.75rem',
                color: 'var(--text-light)',
                fontWeight: 500,
                marginLeft: '0.35rem',
              }}
            >
              (Haftalık)
            </span>
          </div>

          <div className="activity-meta">
            <div className="activity-meta-item positive-pill">
              <span>▲</span>
              <span>+%10 puan geçen haftaya göre</span>
            </div>

            <div className="activity-meta-item">
              <span className="dot yellow" />
              <span>Matematik</span>
            </div>

            <div className="activity-meta-item">
              <span className="dot purple" />
              <span>Türkçe</span>
            </div>
          </div>
        </div>

        <div className="panel-head-right">
          <div className="panel-mini-stat">
            <div className="value" id="hoursSpentLabel">
              85
            </div>
            <div className="pill-change">
              <span>▲ 10%</span>
            </div>
            <span>Başarım Ortalaması</span>
          </div>

          <div className="panel-mini-stat">
            <div className="value" id="avgScoreLabel">
              86
            </div>
            <div className="pill-change down">
              <span>▼ 10%</span>
            </div>
            <span>Ortalama Skor</span>
          </div>

          
        </div>
      </div>

      {/* 🔹 ORTADAKİ SEÇİM KISMI */}
      <div className="activity-filter-row">
        <label htmlFor="activitySelect" className="activity-filter-label">
          Aktiviteyi filtrele:
        </label>
        <select
          id="activitySelect"
          className="activity-filter-select"
          value={selectedActivity}
          onChange={handleActivityChange}
        >
          {activityOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>

        <span className="activity-filter-current">
          Şu an: <strong>{selectedActivity}</strong>
        </span>
      </div>

      <div className="hours-chart-wrapper">
        <div className="chart-area">
          <canvas ref={canvasRef} />
        </div>

        <div className="chart-side-stats">
          <div className="chart-side-row">
            <div className="label">Toplam Sınav</div>
            <div className="big" id="totalHoursLabel">
              12
            </div>
          </div>
          <div className="chart-side-row">
            <div className="label">En Başarılı Sınav</div>
            <div className="big" id="bestDayLabel">
              12 Şubat - Türkçe - Ses Bilgisi
            </div>
          </div>
          <div className="chart-side-row">
            <div className="label">En Başarılı Sınav Başarı Oranı</div>
            <div className="big" id="longestSessionLabel">
              %98
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HoursActivity;
