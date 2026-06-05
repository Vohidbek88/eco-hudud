import { NavLink, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaMapMarkedAlt, FaTint, FaTrashAlt, FaTree, FaWind,FaCloud } from 'react-icons/fa'
import { WiHumidity } from "react-icons/wi";
import Map from '../components/Map'

const CATEGORIES = [
  { to: '/xarita', label: 'Umumiy xarita', icon: FaMapMarkedAlt, end: true },
  { to: '/xarita/suv', label: 'Suv', icon: FaTint },
  { to: '/xarita/chiqindi', label: 'Chiqindi', icon: FaTrashAlt },
  { to: '/xarita/atmosfera', label: 'Atmosfera', icon: WiHumidity },
  { to: '/xarita/yashil-makon', label: 'Yashil makon', icon: FaTree },
]

export default function MapPage({ activeTab }) {
  const navigate = useNavigate()

  function handleBack() {


    navigate('/')
  }

  return (
    <main className="map-page">
      <div className="map-stage">
        <aside className="map-categories" aria-label="Xarita kategoriyalari">
          <button className="map-back-button" type="button" onClick={handleBack}>
            <FaArrowLeft aria-hidden="true" />
            <span>Qaytish</span>
          </button>
          <span className="map-menu-title">Kategoriyalar</span>
          {CATEGORIES.map((category) => {
            const Icon = category.icon

            return (
              <NavLink
                key={category.to}
                to={category.to}
                end={category.end}
                className={({ isActive }) => `category-tab ${isActive ? 'active' : ''}`}
              >
                <Icon className="category-icon" aria-hidden="true" />
                <span>{category.label}</span>
              </NavLink>
            )
          })}
        </aside>
        <Map activeTab={activeTab} />
      </div>
    </main>
  )
}
