import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, GeoJSON, Tooltip } from 'react-leaflet'
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

// Tuman va shaharlarning OpenStreetMap ID-lari ro'yxati
const DISTRICT_BOUNDARY_IDS = {
  'Guliston shahri': 'relation/8310445',
  'Yangiyer shahri': 'relation/11086479',
  'Xovos tumani': 'relation/11086994',
  'Mirzaobod tumani': 'relation/11087046',
  'Boyovut tumani': 'relation/11086477',
  'Сирдарё тумани': 'relation/11087876',
  'Сайхунобод тумани': 'relation/11087853',
  'Сардоba тумани': 'relation/11087239',
  'Оқолтин тумани': 'relation/11087238',
  'Гулистон тумани': 'relation/11087519',
  'Ширин шаҳар': 'way/140375240',
}

const regionStyle = {
  color: '#00c853',
  weight: 4,
  fillColor: 'transparent',
  opacity: 0.9,
  interactive: false
}

const uzbBorderStyle = {
  color: '#cbd5e1', 
  weight: 1.5, 
  fillColor: '#f8fafc', 
  fillOpacity: 0.6, 
  dashArray: '3 3',
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
  const [hoveredDistrict, setHoveredDistrict] = useState(null) // Hover bo'lgan tuman ID si
  
  const status = STATUS[activeTab] ?? STATUS.overview
  const StatusIcon = status.icon
  const activeWasteSite = WASTE_SITES.find((site) => site.id === activeWasteId)

  const sirdaryoBounds = [
    [39.8, 67.5], 
    [41.2, 69.5]  
  ];

  useEffect(() => {
    if (activeTab !== 'waste') {
      setActiveWasteId(null)
    }
  }, [activeTab])

  // DINAMIK HOVER STILI: Sichqoncha ustiga kelganda yorqinlashadi
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

  // SICHQONCHA EVENTLARI VA DOIMIY TOOLTIP BOG'LASH
  const onEachDistrict = (feature, layer) => {
    const districtName = Object.keys(DISTRICT_BOUNDARY_IDS).find(
      (key) => DISTRICT_BOUNDARY_IDS[key] === feature.id
    );

    // 1. Tuman nomini doimiy ko'rinadigan qilib Tooltip orqali bog'lash
    if (districtName) {
      layer.bindTooltip(districtName, {
        permanent: true,       // Xaritaga kirganda doimiy ko'rinib turadi
        direction: 'center',   // Tumanning markazida chiqadi
        className: 'custom-district-tooltip', // CSS orqali dizayn berish uchun
        sticky: false
      });
    }

    // 2. Hover eventlari (faqat chegara va background rangini o'zgartiradi)
    layer.on({
      mouseover: (e) => {
        setHoveredDistrict(feature.id);
        // Leaflet ba'zan dinamik stilni render qilishi uchun chuqur elementni tepaga chiqarish kerak
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
        center={[40.55, 68.65]} 
        zoom={9}              
        minZoom={8.5}           
        maxZoom={15}            
        maxBounds={sirdaryoBounds} 
        maxBoundsViscosity={1.0}   
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />
        
        {/* 1. O'zbekiston chegarasi */}
        <GeoJSON
          data={uzbBorderData}
          style={uzbBorderStyle}
        />

        {/* 2. Sirdaryoning ichki tuman va shaharlari (Tooltip va Hover effektlar shu yerda) */}
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