import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  FaHouseUser, 
  FaCircleInfo, 
  FaMapLocationDot, 
  FaPhoneVolume, 
  FaRegEnvelopeOpen, 
  FaTelegram 
} from 'react-icons/fa6'; // Zamonaviy va qalin piktogrammalar
import { FiShield } from 'react-icons/fi'; // Minimalistik va premium logo ikonkasi
import "../styles/navbar.css";

// Navigatsiya havolalari massiviga tegishli React komponent piktogrammalarini biriktiramiz
const NAV_LINKS = [
  { to: '/', label: 'Bosh sahifa', icon: FaHouseUser, end: true },
  { to: '/biz-haqimizda', label: 'Biz haqimizda', icon: FaCircleInfo },
  { to: '/xarita', label: 'Xarita', icon: FaMapLocationDot },
];

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Sahifa scroll bo'lishini kuzatish
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`navbar-wrapper ${isScrolled ? 'scrolled' : ''}`}>
      {/* 1. YUQORI PANEL (TOPBAR) */}
      <div className="nav-topbar">
        <div className="nav-container-inner">
          
          {/* Logo */}
          <NavLink to="/" className="nav-brand">
            <div className="nav-logo-icon">
              <FiShield />
            </div>
            <div className="nav-logo-text">
              <span className="logo-title">ECO-HUDUD</span>
            </div>
          </NavLink>

          {/* Kontaktlar paneli */}
          <div className="nav-contacts-wrapper">
            <a href="tel:+998712030304" className="contact-item">
              <div className="contact-icon-box">
                <FaPhoneVolume />
              </div>
              <div className="contact-text">
                <span className="contact-label">Savollaringiz bormi?</span>
                <span className="contact-value">+998(71) 203-03-04</span>
              </div>
            </a>

            <a href="mailto:info@ecoekspertiza.uz" className="contact-item">
              <div className="contact-icon-box">
                <FaRegEnvelopeOpen />
              </div>
              <div className="contact-text">
                <span className="contact-label">Pochta</span>
                <span className="contact-value">info@ecoekspertiza.uz</span>
              </div>
            </a>

            <a href="https://t.me/guruh" target="_blank" rel="noreferrer" className="contact-item">
              <div className="contact-icon-box">
                <FaTelegram />
              </div>
              <div className="contact-text">
                <span className="contact-label">Telegram kanal</span>
                <span className="contact-value">Telegramdagi guruh</span>
              </div>
            </a>
          </div>

          {/* Mobil Gamburger Tugmasi */}
          <button 
            className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`} 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menyu"
          >
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </button>

        </div>
      </div>

      {/* 2. ASOSIY NAVIGATSIYA MENYUSI */}
      <nav className={`nav-main-menu ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="nav-container-inner menu-center-layout">

          {/* Markazlashtirilgan Linklar */}
          <div className="nav-links-centered">
            {NAV_LINKS.map((link) => {
              const LinkIcon = link.icon; // Ikonka komponentini o'zgaruvchiga olamiz
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.end}
                  className={({ isActive }) => `premium-menu-item ${isActive ? 'active' : ''}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {/* Mobilda matn yonida ikonka ham chiroyli chiqishi uchun */}
                  <span className="menu-link-content">
                    <LinkIcon className="responsive-link-icon" />
                    {link.label}
                  </span>
                </NavLink>
              );
            })}
          </div>

        </div>
      </nav>
    </header>
  );
}