import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { 
  FaDroplet, 
  FaTrashCan, 
  FaWind, 
  FaTree, 
  FaCircleCheck, 
  FaArrowRightLong, 
  FaChartPie, 
  FaMapLocationDot 
} from 'react-icons/fa6';
import "../styles/home.css";

export default function Home() {
  const [stats, setStats] = useState({ sites: 0, water: 0, area: 0, trees: 0 });

  useEffect(() => {
    // Kelajakda API ulash uchun tayyor dinamik struktura
    setStats({ sites: 14, water: 8, area: 4200, trees: 250000 });
  }, []);

  return (
    <main className="home-premium-page">
      
      {/* 1. ULTRA HERO SECTION (Dizayn asosi) */}
      <section className="premium-hero">
        <div className="hero-overlay-glow"></div>
        <div className="hero-container">
          
          <div className="hero-content">
            <h1 className="hero-main-title">
              Eko-Barqarorlik <br />
              <span>Raqamli Nazoratda</span>
            </h1>
            <p className="hero-description">
              Hududdagi suv obyektlari, chiqindi poligonlari, atmosfera havosi tozaligi va yashil maydonlarni 
              shaffof interaktiv xarita hamda sun'iy yo'ldosh ma'lumotlari orqali real vaqtda kuzating.
            </p>
            <div className="hero-action-buttons">
              <Link to="/xarita" className="btn-hero-primary">
                <FaMapLocationDot /> Interaktiv Xarita
              </Link>
              <Link to="/biz-haqimizda" className="btn-hero-secondary">
                Tizim Haqida <FaArrowRightLong />
              </Link>
            </div>
          </div>

          <div className="hero-visual-card">
            <div className="card-image-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80" 
              alt="Eco-Hudud Landshaft" 
              className="main-hero-img" 
            />
            {/* Rasm ustidagi mini interaktiv widget */}
            <div className="hero-floating-widget">
              <div className="widget-icon"><FaWind className="wind-pulse" /></div>
              <div>
                <h4>Havo Sifati (AQI)</h4>
                <p>Guliston shahri: 42 (A'lo)</p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. PREMIUM STATISTIKA PANELI */}
      <section className="premium-stats-section">
        <div className="stats-grid-wrapper">
          
          <div className="glass-stat-card">
            <div className="stat-icon-circle"><FaTrashCan /></div>
            <div className="stat-info">
              <span className="counter-num">{stats.sites} ta</span>
              <span className="counter-title">Chiqindi poligonlari</span>
            </div>
          </div>

          <div className="glass-stat-card">
            <div className="stat-icon-circle water-accent"><FaDroplet /></div>
            <div className="stat-info">
              <span className="counter-num">{stats.water} ta</span>
              <span className="counter-title">Yirik suv havzalari</span>
            </div>
          </div>

          <div className="glass-stat-card">
            <div className="stat-icon-circle air-accent"><FaWind /></div>
            <div className="stat-info">
              <span className="counter-num">11 ta</span>
              <span className="counter-title">Atmosfera datchiklari</span>
            </div>
          </div>

          <div className="glass-stat-card">
            <div className="stat-icon-circle tree-accent"><FaTree /></div>
            <div className="stat-info">
              <span className="counter-num">{(stats.trees / 1000).toFixed(0)}K +</span>
              <span className="counter-title">Yashil makon nihollari</span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. TO'RTTA ASOSIY EKOLOGIK QATLAM (FEATURE GRID) */}
      <section className="ecological-layers-section">
        <div className="section-header-centered">
          <span className="section-subtitle">Tizim imkoniyatlari</span>
          <h2 className="section-main-title">To'rtta Ustuvor Ekologik Yo'nalish</h2>
          <div className="title-divider"></div>
        </div>

        <div className="layers-grid">
          
          {/* Suv Havzalari */}
          <article className="layer-card">
            <div className="layer-img-container">
              <img src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80" alt="Suv monitoringi" />
              <div className="layer-icon-badge water-bg"><FaDroplet /></div>
            </div>
            <div className="layer-body">
              <h3>Suv Obyektlari Monitoringi</h3>
              <p>Sirdaryo havzasi, kanallar va kollektorlarning gidrologik holati hamda kimyoviy tahlil nuqtalari koordinatalari.</p>
              <Link to="/xarita?tab=water" className="layer-action-link">Suv qatlamini ochish <FaArrowRightLong /></Link>
            </div>
          </article>

          {/* Chiqindi poligonlari */}
          <article className="layer-card">
            <div className="layer-img-container">
              <img src="https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=600&q=80" alt="Chiqindi poligonlari" />
              <div className="layer-icon-badge waste-bg"><FaTrashCan /></div>
            </div>
            <div className="layer-body">
              <h3>Chiqindi Poligonlari Nazorati</h3>
              <p>Qattiq maishiy chiqindi (QMCh) poligonlarining MFY kesimidagi chegaralari, yillik sig'imi va sanitariya zonalari tahlili.</p>
              <Link to="/xarita?tab=waste" className="layer-action-link">Chiqindi qatlamini ochish <FaArrowRightLong /></Link>
            </div>
          </article>

          {/* Atmosfera havosi */}
          <article className="layer-card">
            <div className="layer-img-container">
              <img src="https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80" alt="Atmosfera havosi" />
              <div className="layer-icon-badge air-bg"><FaWind /></div>
            </div>
            <div className="layer-body">
              <h3>Atmosfera Havosi Sifati</h3>
              <p>Havodagi zararli gazlar (PM2.5, PM10, CO) miqdorini avtomatlashtirilgan datchiklar yordamida real vaqt rejimida tahlil qilish.</p>
              <Link to="/xarita?tab=air" className="layer-action-link">Havo sifatini ko'rish <FaArrowRightLong /></Link>
            </div>
          </article>

          {/* Yashil makon */}
          <article className="layer-card">
            <div className="layer-img-container">
              <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80" alt="Yashil makon" />
              <div className="layer-icon-badge tree-bg"><FaTree /></div>
            </div>
            <div className="layer-body">
              <h3>Yashil Makon & Geoportal</h3>
              <p>Yashil maydonlar, ekilgan yangi nihollar, o'rmon xo'jaliklari hududlarining elektron xaritasi va yashillik indeksi (NDVI).</p>
              <Link to="/xarita?tab=green" className="layer-action-link">Yashil hududlarni ko'rish <FaArrowRightLong /></Link>
            </div>
          </article>

        </div>
      </section>

      {/* 4. STRATEGIK MISSIYA VA STRUKTURA BLOKI */}
      <section className="premium-mission-section">
        <div className="mission-split-container">
          
          <div className="mission-graphic-side">
            <div className="glass-blur-info-box">
              <div className="info-box-header">
                <FaChartPie /> <span>Geo-Statistika</span>
              </div>
              <p>Sirdaryo viloyatining barcha tuman va shaharlari yagona GeoJSON xaritasiga to'liq raqamlashtirildi.</p>
            </div>
            <img 
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80" 
              alt="Ekologik tahlillar" 
              className="mission-bg-img"
            />
          </div>

          <div className="mission-text-side">
            <span className="text-badge">Bizning maqsadimiz</span>
            <h2 className="mission-title">Ochiq Ma'lumotlar Orqali Ekologik Barqarorlik</h2>
            <p className="mission-desc">
              "Eco Hudud" portali viloyat hokimligi hamda Ekologiya boshqarmasi hamkorligida yaratilgan bo'lib, 
              hududiy muammolarni xatlovdan o'tkazish, geo-lokatsiyasini aniqlash va jamoatchilik nazoratini 
              kuchaytirish uchun eng ishonchli raqamli vositadir.
            </p>

            <div className="premium-points-list">
              <div className="premium-point">
                <div className="point-check-icon"><FaCircleCheck /></div>
                <div>
                  <h4>Aniq va Tasdiqlangan Geo-Koordinatalar</h4>
                  <p>Har bir obyekt Davlat kadastri ma'lumotlari bilan sinxronizatsiya qilingan.</p>
                </div>
              </div>

              <div className="premium-point">
                <div className="point-check-icon"><FaCircleCheck /></div>
                <div>
                  <h4>Tezkor va Shaffof Tahliliy Hisobotlar</h4>
                  <p>Yuridik shaxslar va poligon mas'ullari uchun ochiq reyting tizimi.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

    </main>
  );
}