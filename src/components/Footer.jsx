import { Link } from 'react-router-dom';
import { 
  FaDroplet, 
  FaTrashCan, 
  FaWind, 
  FaTree, 
  FaTelegram, 
  FaYoutube, 
  FaInstagram, 
  FaFacebookF,
  FaPhone,
  FaEnvelope,
  FaLocationDot,
  FaArrowUpLong
} from 'react-icons/fa6';
import { FiShield } from 'react-icons/fi';
import "../styles/footer.css";

export default function Footer() {
  
  // Sahifani tepaga silliq ko'tarish funksiyasi
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="premium-footer">
      <div className="footer-glow-radial"></div>
      
      <div className="footer-container">
        
        {/* YUQORI QISM: Brending va Ijtimoiy tarmoqlar */}
        <div className="footer-top-row">
          
          <div className="footer-brand-side">
            <div className="f-logo-wrap">
              <div className="f-logo-icon">
                <img src="./eco-hudud-logo.png" alt="ECO-HUDUD Logo" />
              </div>
              <span className="f-logo-text">ECO-HUDUD</span>
            </div>
            <p className="f-brand-desc">
              Sirdaryo viloyati ekologik monitoring va raqamli geo-ma'lumotlar platformasi. 
              Tabiatni birgalikda asraylik.
            </p>
          </div>

          <div className="footer-social-side">
            <span className="social-title">Bizni kuzating:</span>
            <div className="social-links-grid">
              <a href="https://t.me" target="_blank" rel="noreferrer" className="social-btn tg" aria-label="Telegram"><FaTelegram /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn insta" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="social-btn yt" aria-label="YouTube"><FaYoutube /></a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-btn fb" aria-label="Facebook"><FaFacebookF /></a>
            </div>
          </div>

        </div>

        <div className="footer-divider"></div>

        {/* O'RTA QISM: Havolalar va Kontaktlar */}
        <div className="footer-main-grid">
          
          {/* 1-Ustun: Yo'nalishlar */}
          <div className="footer-links-col">
            <h3 className="col-title">Ekologik Qatlamlar</h3>
            <ul className="footer-menu-list">
              <li><Link to="/xarita?tab=water"><FaDroplet className="col-icon-water" /> Suv obyektlari</Link></li>
              <li><Link to="/xarita?tab=waste"><FaTrashCan className="col-icon-waste" /> Chiqindi poligonlari</Link></li>
              <li><Link to="/xarita?tab=air"><FaWind className="col-icon-air" /> Havo sifati (AQI)</Link></li>
              <li><Link to="/xarita?tab=green"><FaTree className="col-icon-tree" /> Yashil makon</Link></li>
            </ul>
          </div>

          {/* 2-Ustun: Menyular */}
          <div className="footer-links-col">
            <h3 className="col-title">Asosiy Sahifalar</h3>
            <ul className="footer-menu-list">
              <li><Link to="/">Bosh sahifa</Link></li>
              <li><Link to="/biz-haqimizda">Biz haqimizda</Link></li>
              <li><Link to="/xarita">Interaktiv xarita</Link></li>
              <li><Link to="/yangiliklar">Yangiliklar & Media</Link></li>
            </ul>
          </div>

          {/* 3-Ustun: Yuridik / Qo'shimcha */}
          <div className="footer-links-col">
            <h3 className="col-title">Foydali</h3>
            <ul className="footer-menu-list">
              <li><a href="#!">Tushuncha va ta'riflar</a></li>
              <li><a href="#!">Ochiq ma'lumotlar (Open Data)</a></li>
              <li><a href="#!">Foydalanish shartlari</a></li>
              <li><a href="#!">Maxfiylik siyosati</a></li>
            </ul>
          </div>

          {/* 4-Ustun: To'g'ridan-to'g'ri Aloqa */}
          <div className="footer-links-col contact-col">
            <h3 className="col-title">Aloqa Markazi</h3>
            <div className="footer-contact-block">
              <a href="tel:+998712030304" className="f-contact-item">
                <FaPhone /> <span>+998 (71) 203-03-04</span>
              </a>
              <a href="mailto:info@ecoekspertiza.uz" className="f-contact-item">
                <FaEnvelope /> <span>info@ecoekspertiza.uz</span>
              </a>
              <div className="f-contact-item address">
                <FaLocationDot /> <span>Guliston sh., Mustaqillik ko'chasi, 4-uy</span>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-divider"></div>

        {/* PASTI QISM: Mualliflik huquqi va Yuqoriga chiqish */}
        <div className="footer-bottom-row">
          <p className="copyright-text">
            &copy; {new Date().getFullYear()} Eco-Hudud. Barcha huquqlar himoyalangan.
          </p>
          
          <button className="btn-scroll-top" onClick={scrollToTop} aria-label="Tezda yuqoriga chiqish">
            Top <FaArrowUpLong />
          </button>
        </div>

      </div>
    </footer>
  );
}