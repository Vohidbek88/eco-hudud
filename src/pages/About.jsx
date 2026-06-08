import { 
  FaRocket, 
  FaEye, 
  FaBullhorn, 
  FaServer, 
  FaChartLine,
  FaShieldHalved
} from 'react-icons/fa6';
import "../styles/about.css";

export default function About() {
  return (
    <main className="about-premium-page">
      <div className="about-overlay-glow"></div>
      
      {/* 1. HERO SECTION */}
      <section className="about-hero">
        <div className="about-container">
          <div className="about-hero-content">
            <h1 className="about-main-title">
              Raqamli Ekologiya <br />
              <span>Kelajagi Bizmiz</span>
            </h1>
            <p className="about-description">
              "Eco-Hudud" — Sirdaryo viloyatining ekologik barqarorligini ta'minlash, 
              tabiiy resurslarni muhofaza qilish va chiqindilarni boshqarish jarayonlarini 
              to'liq raqamlashtirishga qaratilgan innovatsion geo-monitoring platformasidir.
            </p>
          </div>
          
          <div className="about-hero-visual">
            <div className="about-card-glow"></div>
            <img 
              src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80" 
              alt="Digital Ecology" 
              className="about-hero-img" 
            />
          </div>
        </div>
      </section>

      {/* 2. MISSIYA VA STRATEGIYA BLOKLARI */}
      <section className="about-cards-section">
        <div className="about-container grid-3-cols">
          
          <div className="premium-about-card">
            <div className="card-icon-box vision-bg"><FaEye /></div>
            <h3>Bizning Vizyon</h3>
            <p>
              Ekologik ma'lumotlarni ochiq, shaffof va har bir fuqaro hamda mutaxassis uchun 
              tushunarli geo-vizualizatsiya ko'rinishida taqdim etish.
            </p>
          </div>

          <div className="premium-about-card">
            <div className="card-icon-box mission-bg"><FaRocket /></div>
            <h3>Asosiy Maqsad</h3>
            <p>
              Sirdaryo viloyatidagi barcha yirik suv havzalari, chiqindi poligonlari va 
              yashil maydonlarni yagona elektron nazorat tizimiga birlashtirish.
            </p>
          </div>

          <div className="premium-about-card">
            <div className="card-icon-box values-bg"><FaShieldHalved /></div>
            <h3>Ishonchlilik</h3>
            <p>
              Platformadagi har bir koordinata va ko'rsatkich rasmiy davlat kadastri hamda 
              ekologik datchiklar tomonidan tasdiqlangan va real vaqtda yangilanadi.
            </p>
          </div>

        </div>
      </section>

      {/* 3. TIMELINE / RIVOJLANISH BOSQICHLARI */}
      <section className="about-timeline-section">
        <div className="about-container">
          <div className="about-section-header">
            <span className="section-subtitle">Bosqichlar</span>
            <h2 className="section-main-title">Platforma Rivojlanish Yo'li</h2>
            <div className="title-divider"></div>
          </div>

          <div className="timeline-wrapper">
            
            <div className="timeline-item">
              <div className="timeline-dot"><FaServer /></div>
              <div className="timeline-content">
                <span className="timeline-phase">1-Bosqich (Yakunlangan)</span>
                <h4>Suv va Chiqindi Obyektlari</h4>
                <p>Hududdagi muhim suv havzalari va qattiq maishiy chiqindi (QMCh) poligonlarini xaritaga tushirish hamda GeoJSON koordinatalarini jamlash.</p>
              </div>
            </div>

            <div className="timeline-item active">
              <div className="timeline-dot"><FaChartLine /></div>
              <div className="timeline-content">
                <span className="timeline-phase">2-Bosqich (Hozirgi jarayon)</span>
                <h4>Atmosfera va Yashil Makon</h4>
                <p>Atmosfera havosi sifati (AQI) datchiklarini integratsiya qilish hamda "Yashil makon" umummilliy loyihasi doirasidagi hududlar monitoringi.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-dot"><FaBullhorn /></div>
              <div className="timeline-content">
                <span className="timeline-phase">3-Bosqich (Kelajakda)</span>
                <h4>Sun'iy intellekt va Tahlil</h4>
                <p>Ekologik o'zgarishlarni sun'iy yo'ldosh rasmlari (NDVI indeksi) orqali bashorat qilish va jamoatchilik uchun tezkor ekologik signal tizimi.</p>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}