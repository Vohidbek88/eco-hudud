import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { useState, useEffect } from 'react'
import "../styles/home.css"
// REACT-ICONS IMPORTLARI
import { TbMap2, TbDroplet, TbTrash, TbCircleCheck } from 'react-icons/tb'

export default function Home() {
  const [stats, setStats] = useState({ sites: 0, water: 0, area: 0 })

  useEffect(() => {
    setStats({ sites: 14, water: 8, area: 4200 })
  }, [])

  return (
    <main className="page home-page">
      {/* 1. HERO SECTION */}
      <section className="home-hero">
        <div className="home-copy">
          <span className="eyebrow">Sirdaryo viloyati uchun ekologik kuzatuv</span>
          <h1>Eco Hudud</h1>
          <p>
            Hududdagi suv obyektlari va chiqindi poligonlari haqidagi ma'lumotlarni
            xarita orqali ko'rish, solishtirish va tez tahlil qilish uchun sodda platforma.
          </p>
          <div className="home-actions">
            <Link to="/xarita" className="primary-link">Xaritani ko'rish</Link>
            <Link to="/biz-haqimizda" className="secondary-link">Biz haqimizda</Link>
          </div>
        </div>

        <div className="home-image-wrap">
          <img src={heroImage} alt="Eco Hudud xaritasi" className="home-image" />
        </div>
      </section>

      {/* 2. STATISTIKA BO'LIMI */}
      <section className="home-stats-section" aria-label="Viloyat ekologik ko'rsatkichlari">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">{stats.sites} ta</span>
            <span className="stat-label">Nazoratdagi QMCh poligonlari</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.water} ta</span>
            <span className="stat-label">Yirik suv havzalari va daryolar</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{stats.area} km²</span>
            <span className="stat-label">Umumiy monitoring maydoni</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURE GRID */}
      <section className="feature-section">
        <div className="section-title-wrap">
          <h2>Platforma imkoniyatlari</h2>
          <p>Sirdaryo viloyatining ekologik holatini turli qatlamlar yordamida tahlil qiling</p>
        </div>
        
        <div className="feature-grid">
          <article className="feature-card">
            <div className="feature-icon-box">
              <TbMap2 size={24} />
            </div>
            <h2>Umumiy xarita</h2>
            <p>Sirdaryo viloyati ma'muriy chegarasi va barcha geo-ma'lumotlarni yagona integratsiyalashgan tizimda kuzating.</p>
            <Link to="/xarita?tab=overview" className="feature-link">Xaritaga o'tish →</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon-box water-icon">
              <TbDroplet size={24} />
            </div>
            <h2>Suv havzalari monitoringi</h2>
            <p>Sirdaryo hududidan oqib o'tuvchi daryolar, sug'orish kanallari va kollektorlarning holati hamda koordinatalari.</p>
            <Link to="/xarita?tab=water" className="feature-link">Suv qatlamini ko'rish →</Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon-box waste-icon">
              <TbTrash size={24} />
            </div>
            <h2>Chiqindi poligonlari</h2>
            <p>Poligonlarning MFY kesimidagi joylashuvi, yillik chiqindi hajmi, maydoni va sanitariya himoya zonalari tahlili.</p>
            <Link to="/xarita?tab=waste" className="feature-link">Chiqindi qatlamini ko'rish →</Link>
          </article>
        </div>
      </section>

      {/* 4. MAQSAD VA MISSIYA BLOKI */}
      <section className="home-mission-section">
        <div className="mission-content">
          <div className="mission-text">
            <span className="section-tag">Bizning maqsadimiz</span>
            <h2>Ochiq ma'lumotlar orqali ekologik barqarorlikka erishish</h2>
            <p>
              "Eco Hudud" loyihasi Sirdaryo viloyatining ekologik holatiga oid geo-ma'lumotlarni 
              shaffof va interaktiv ko'rinishda taqdim etadi. Bu mutaxassislar va keng jamoatchilik uchun 
              hududdagi chiqindi va suv muammolarini tezkor anglash hamda tahlil qilish imkonini beradi.
            </p>
            <div className="mission-points">
              <div className="point-item">
                <TbCircleCheck size={20} /> <span>Aniq va tekshirilgan GeoJSON koordinatalar</span>
              </div>
              <div className="point-item">
                <TbCircleCheck size={20} /> <span>Tuman va shaharlar kesimidagi yuridik ma'lumotlar</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}