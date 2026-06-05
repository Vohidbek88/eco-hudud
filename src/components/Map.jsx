import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { FaMapMarkedAlt, FaTint, FaTrashAlt, FaTree, FaWind } from 'react-icons/fa'
import 'leaflet/dist/leaflet.css'
import sirdaryoData from '../data/sirdaryo.json'
import { WASTE_SITES } from '../data/wasteData'
import WasteLayer, { WasteDetailsSidebar } from './layers/WasteLayer'
import WaterLayer from './layers/WaterLayer'

const regionStyle = {
  color: '#2c3e50',
  weight: 2,
  fillColor: '#d5e8d4',
  fillOpacity: 0.12,
  dashArray: '5',
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
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
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
