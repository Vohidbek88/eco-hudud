import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'

export default function Home() {
  return (
    <main className="page home-page">
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

      <section className="feature-grid" aria-label="Asosiy bo'limlar">
        <article className="feature-card">
          <i className="ti ti-map" />
          <h2>Xarita</h2>
          <p>Sirdaryo viloyati chegarasi va ekologik obyektlarni umumiy ko'rinishda kuzating.</p>
        </article>
        <article className="feature-card">
          <i className="ti ti-droplet" />
          <h2>Suv</h2>
          <p>Daryo, kanal va kollektorlar haqidagi ma'lumotlarni xaritada ko'ring.</p>
        </article>
        <article className="feature-card">
          <i className="ti ti-trash" />
          <h2>Chiqindi</h2>
          <p>Chiqindi poligonlari joylashuvi va asosiy ko'rsatkichlari bilan tanishing.</p>
        </article>
      </section>
    </main>
  )
}
