import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet'
import { FaMapMarkedAlt, FaTint, FaTrashAlt, FaTree, FaWind } from 'react-icons/fa'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import sirdaryoData from '../data/sirdaryo.json'
import sirdaryoTumansData from '../data/sirdaryo-tumanlari.json'
import uzbBorderData from '../data/uzbekistan-border.json'
import { WASTE_SITES } from '../data/wasteData'
import WasteLayer, { WasteDetailsSidebar } from './layers/WasteLayer'
import WaterLayer from './layers/WaterLayer'
import AtmosphereLayer from './layers/AtmosphereLayer'
import YashilMakonLayer from './layers/GreenCoverLayer'

// Tuman va shaharlarning OpenStreetMap ID-lari ro'yxati
const DISTRICT_BOUNDARY_IDS = {
  'Guliston shahri': 'relation/8310445',
  'Yangiyer shahri': 'relation/11086479',
  'Xovos tumani': 'relation/11086994',
  'Mirzaobod Tumani': 'relation/11087046',
  'Boyovut Tumani': 'relation/11086477',
  'Sirdaryo Tumani': 'relation/11087876',
  'Sayxunobod Tumani': 'relation/11087853',
  'Sardoba Tumani': 'relation/11087239',
  'Оqolotin Tumani': 'relation/11087238',
  'Guliston Tumani': 'relation/11087519',
  'Shirin shahri': 'way/140375240',
}

// Sirdaryo tashqi chegarasi
const regionStyle = {
  color: '#00c853',
  weight: 4,
  fillColor: 'transparent',
  opacity: 0.9,
  interactive: false
}

// O'ZBEKISTON CHEGARASI STILI: Endi aniq ko'rinadigan to'q ko'k rang va yarim shaffof fon berildi
const uzbBorderStyle = {
  color: '#1e3b8a',      // To'q ko'k chegara chizig'i
  weight: 2.5, 
  fillColor: '#3b83f62d',  
  fillOpacity: 0.15,     // O'zbekiston hududi yaqqol ajralib turishi uchun yengil ko'k fon
  dashArray: '6 6',
  interactive: false
}

const baseDistrictStyle = {
  color: '#2e7d3260',       
  weight: 1.2,             
  fillColor: '#a8b8a9',   
  fillOpacity: 0.35,       
}

function getRegionOnly(data) {
  return {
    ...data,
    features: data.features.filter((feature) => feature.id === 'relation/196253'),
  }
}

function getDistrictsOnly(data) {
  const allowedIds = Object.values(DISTRICT_BOUNDARY_IDS);
  return {
    ...data,
    features: data.features.filter((feature) => allowedIds.includes(feature.id)),
  }
}

const STATUS = {
  overview: { icon: FaMapMarkedAlt, text: 'Sirdaryo viloyati xaritasi' },
  waste: { icon: FaTrashAlt, text: 'Chiqindi layeri faol' },
  water: { icon: FaTint, text: 'Suv layeri faol' },
  atmosphere: { icon: FaWind, text: 'Atmosfera layeri faol' },
  green: { icon: FaTree, text: 'Yashil makon layeri faol' },
}

export default function Map({ activeTab = 'overview' }) {
  const [activeWasteId, setActiveWasteId] = useState(null)
  const [hoveredDistrict, setHoveredDistrict] = useState(null)
  
  const status = STATUS[activeTab] ?? STATUS.overview
  const StatusIcon = status.icon
  const activeWasteSite = WASTE_SITES.find((site) => site.id === activeWasteId)

  // O'ZBEKISTON BOUNDS: Foydalanuvchi bemalol O'zbekiston ichida xaritani surishi mumkin
  const uzbekistanBounds = [
    [37.0, 55.0], // Janubiy-g'arbiy nuqta
    [46.5, 74.0]  // Shimoliy-sharqiy nuqta
  ];

  useEffect(() => {
    if (activeTab !== 'waste') {
      setActiveWasteId(null)
    }
  }, [activeTab])

  const getDynamicDistrictStyle = (feature) => {
    const isHovered = hoveredDistrict === feature.id;
    return {
      ...baseDistrictStyle,
      fillColor: isHovered ? '#ebf8ec9c' : baseDistrictStyle.fillColor, 
      fillOpacity: isHovered ? 0.6 : baseDistrictStyle.fillOpacity,
      weight: isHovered ? 2.5 : baseDistrictStyle.weight,
      color: isHovered ? '#1b5e1f15' : baseDistrictStyle.color
    }
  }

  const onEachDistrict = (feature, layer) => {
    const districtName = Object.keys(DISTRICT_BOUNDARY_IDS).find(
      (key) => DISTRICT_BOUNDARY_IDS[key] === feature.id
    );

    if (districtName) {
      layer.bindTooltip(districtName, {
        permanent: true,       
        direction: 'center',   
        className: 'custom-district-tooltip', 
        sticky: false
      });
    }

    layer.on({
      mouseover: (e) => {
        setHoveredDistrict(feature.id);
        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
          layer.bringToFront();
        }
      },
      mouseout: (e) => {
        setHoveredDistrict(null);
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e);
      }
    });
  }

  return (
    <div className="map-wrapper">
      <MapContainer
        center={[40.55, 68.65]} // Sirdaryo qoq markazi
        zoom={9}                // Boshlang'ich optimal zoom
        minZoom={6}             // Butun O'zbekiston ko'rinishi uchun uzoqlashishga ruxsat
        maxZoom={15}            
        maxBounds={uzbekistanBounds} // Qulflash chegarasini Sirdaryodan O'zbekistonga kengaytirdik
        maxBoundsViscosity={0.7}    // Qattiq qulflash o'rniga yumshoq to'siq (surish ancha qulay)
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        {/* 1. O'zbekiston chegarasi (Endi OpenStreetMap ustida chiroyli ko'rinadi) */}
        <GeoJSON
          data={uzbBorderData}
          style={uzbBorderStyle}
        />

        {/* 2. Sirdaryoning ichki tuman va shaharlari */}
        {activeTab === 'overview' && (
          <GeoJSON 
            data={getDistrictsOnly(sirdaryoTumansData)} 
            style={getDynamicDistrictStyle} 
            onEachFeature={onEachDistrict}
          />
        )}

        {/* 3. Sirdaryo viloyatining qalin yashil tashqi chegarasi */}
        <GeoJSON 
          data={getRegionOnly(sirdaryoData)} 
          style={regionStyle} 
        />

        {/* Shartli qatlamlar */}
        {activeTab === 'waste' && (
          <WasteLayer activeId={activeWasteId} onSelectSite={setActiveWasteId} />
        )}
        {activeTab === 'water' && <WaterLayer />}
        {activeTab === 'atmosphere' && <AtmosphereLayer />}
        {activeTab === 'green' && <YashilMakonLayer sirdaryoDistrictsGeoJSON={sirdaryoTumansData} />}
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