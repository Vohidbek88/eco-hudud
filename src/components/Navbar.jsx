import { NavLink } from 'react-router-dom'
import "../styles/navbar.css"
const NAV_LINKS = [
  { to: '/', label: 'Bosh sahifa', icon: 'ti-home', end: true },
  { to: '/biz-haqimizda', label: 'Biz haqimizda', icon: 'ti-info-circle' },
  { to: '/xarita', label: 'Xarita', icon: 'ti-map' },
]

export default function Navbar() {
  return (
    <header className="navbar">
      <div className="nav-topbar">
        <div className="nav-topbar-inner">
          <span>
            <i className="ti ti-building-community" />
            Sirdaryo viloyati ekologik ma'lumotlar portali
          </span>
          <div className="nav-toplinks">
            <a href="tel:+998000000000">
              <i className="ti ti-phone" />
              Aloqa
            </a>
            <a href="mailto:info@ecohudud.uz">
              <i className="ti ti-mail" />
              info@ecohudud.uz
            </a>
            <span>O'z</span>
          </div>
        </div>
      </div>

      <nav className="nav-main" aria-label="Asosiy navigatsiya">
        <div className="nav-brand">
          <NavLink to="/" className="nav-logo">
            <div className="nav-logo-icon">
              <i className="ti ti-leaf" />
            </div>
            <span className="nav-logo-text">
              Eco <strong>Hudud</strong>
            </span>
          </NavLink>
          <span className="nav-subtitle">Ekologik monitoring platformasi</span>
        </div>

        <div className="nav-tabs">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) => `nav-tab ${isActive ? 'active' : ''}`}
            >
              <i className={`ti ${link.icon}`} />
              {link.label}
            </NavLink>
          ))}
        </div>

        <div className="nav-region">
          <i className="ti ti-map-pin" />
          Sirdaryo viloyati
        </div>
      </nav>
    </header>
  )
}
