import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { FaMapMarkedAlt, FaTint, FaTrashAlt, FaTree, FaWind } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import sirdaryoData from '../data/sirdaryo.json'
import uzbBorderData from '../data/uzbekistan-border.json'
import { WASTE_SITES } from '../data/wasteData'
import WasteLayer, { WasteDetailsSidebar } from './layers/WasteLayer'
import WaterLayer from './layers/WaterLayer'

const regionStyle = {
  color: '#06f312',
  weight: 4,
  fillColor: '#d5e8d4',
  fillOpacity: 0.12,
  dashArray: '5',
}

const uzbBorderStyle = {
  color: '#062249',       // Kulrang-ko'k chegara chizig'i
  weight: 2,              // Chiziq qalinligi
  fillColor: '#f8fafc',   // O'zbekistonning ichki qismi foni (och qoramtir/oqish)
  fillOpacity: 0.4,       // Qo'shni davlatlardan ajralib turishi uchun yengil fon beramiz
  dashArray: '4 4'        // Uzuq-uzuq chiziq (chegara ekanligini bildirish uchun)
}

function getRegionOnly(data) {
  return {
    ...data,
    features: data.features.filter((feature) => feature.id === 'relation/196253'),
  }
}

const STATUS = {
  overview: { icon: FaMapMarkedAlt, text: 'Sirdaryo viloyati xaritasi' },
  waste: { icon: FaTrashAlt, text: 'Chiqindi layeri faol' },
  water: { icon: FaTint, text: 'Suv layeri faol' },
  atmosphere: { icon: FaWind, text: 'Atmosfera ma\'lumotlari tayyorlanmoqda' },
  green: { icon: FaTree, text: 'Yashil makon ma\'lumotlari tayyorlanmoqda' },
}

export default function Map({ activeTab = 'overview' }) {
  const [activeWasteId, setActiveWasteId] = useState(null)
  const status = STATUS[activeTab] ?? STATUS.overview
  const StatusIcon = status.icon
  const activeWasteSite = WASTE_SITES.find((site) => site.id === activeWasteId)

  const centralAsiaBounds = [
    [35.0, 55.0], // Janubiy-g'arbiy nuqta (Turkmaniston/Afg'oniston atrofi)
    [46.0, 75.0]  // Shimoliy-sharqiy nuqta (Qozog'iston/Qirg'iziston chekkalari)
  ];

  useEffect(() => {
    if (activeTab !== 'waste') {
      setActiveWasteId(null)
    }
  }, [activeTab])

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[40.5, 68.8]}
        zoom={9}
        minZoom={6}           // Foydalanuvchi xaritani judayam uzoqlashtirib, dunyoni ko'rib ketmasligi uchun
        maxZoom={16}          // Judayam yaqinlashib ketishni cheklash
        maxBounds={centralAsiaBounds} // Xaritani shu hududga qulflash
        maxBoundsViscosity={1.0}     // 1.0 qiymat foydalanuvchini chegaradan tashqariga umuman chiqarmaydi
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        <GeoJSON
          data={uzbBorderData}
          style={uzbBorderStyle}
        />
        <GeoJSON data={getRegionOnly(sirdaryoData)} style={regionStyle} />

        {activeTab === 'waste' && (
          <WasteLayer activeId={activeWasteId} onSelectSite={setActiveWasteId} />
        )}
        {activeTab === 'water' && <WaterLayer />}
      </MapContainer>

      {activeTab === 'waste' && (
        <WasteDetailsSidebar
          site={activeWasteSite}
          onClose={() => setActiveWasteId(null)}
        />
      )}

      <div className="map-status">
        <StatusIcon className="map-status-icon" aria-hidden="true" />
        <span>{status.text}</span>
      </div>
    </div>
  )
}
