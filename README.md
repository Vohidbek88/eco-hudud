# React + Vite

⚒️kirganda alohida tuman shahar ajralib tursin chegarasi bilan
suv kanallari togri taqsimlash

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

const NAV_LINKS = [

  { to: '/', label: 'Bosh sahifa', icon: 'ti-home', end: true },

  { to: '/biz-haqimizda', label: 'Biz haqimizda', icon: 'ti-info-circle' },

  { to: '/xarita', label: 'Xarita', icon: 'ti-map' },

]

import { useState } from 'react'
import { GeoJSON, Popup } from 'react-leaflet'
// Overpass Turbo orqali yuklab olingan yangi GeoJSON faylingiz
import sirdaryoWaterData from '../../data/sirdaryo-suv-havzalari.json'

// Suv obyektlari turlariga qarab boshlang'ich stillar (rang, qalinlik va ikonka)
const WATER_CONFIGS = {
  river: {
    color: '#1d4ed8', // To'q ko'k
    weight: 5,
    label: 'Daryo',
    icon: '🌊'
  },
  canal: {
    color: '#2563eb', // Ochiqroq ko'k
    weight: 3.5,
    label: 'Kanal',
    icon: '🔲'
  },
  drain: {
    color: '#06b6d4', // Firuza / Zangori
    weight: 2,
    label: 'Kollektor / Zovur',
    icon: '➖',
    dashArray: '5 5' // Zovurlarni uzuq-uzuq chiziq qilish
  },
  ditch: {
    color: '#0ea5e9', 
    weight: 1.5,
    label: 'Ariq / Zovur',
    icon: '➖',
    dashArray: '4 4'
  }
}

export default function WaterLayer() {
  const [activeFeature, setActiveFeature] = useState(null)
  const [popupPos, setPopupPos] = useState(null)

  // Har bir chiziq (way) uchun dinamik stil berish funksiyasi
  const getStyle = (feature) => {
    const type = feature.properties?.waterway || 'river'
    const config = WATER_CONFIGS[type] || WATER_CONFIGS.river
    
    // Agar foydalanuvchi chiziq ustiga bossa, o'sha chiziq ID si bo'yicha urg'u beriladi
    const isActive = activeFeature?.properties?.['@id'] === feature.properties?.['@id']

    return {
      color: config.color,
      weight: isActive ? config.weight + 2.5 : config.weight,
      opacity: isActive ? 1 : 0.75,
      dashArray: config.dashArray || null,
      fillOpacity: 0,
    }
  }

  // Chiziq bosilgandagi mantiq
  const onEachFeature = (feature, layer) => {
    layer.on({
      click: (e) => {
        // Leafletning standart GeoJSON bosilish hodisasi xaritaning o'ziga o'tib ketmasligi uchun
        L.DomEvent.stopPropagation(e) 
        setActiveFeature(feature)
        setPopupPos(e.latlng)
      }
    })
  }

  return (
    <>
      {/* Yagona GeoJSON qatlami hamma ma'lumotni o'zi chizadi */}
      <GeoJSON
        data={sirdaryoWaterData}
        style={getStyle}
        onEachFeature={onEachFeature}
      />

      {/* Tanlangan faol suv yo'li uchun interaktiv Popup */}
      {activeFeature && popupPos && (
        <Popup
          position={popupPos}
          onClose={() => { setActiveFeature(null); setPopupPos(null) }}
          maxWidth={280}
        >
          <WaterPopup feature={activeFeature} />
        </Popup>
      )}

      {/* O'ng pastki burchakdagi umumiy Legend (Yo'riqnoma) */}
      <WaterLegend activeType={activeFeature?.properties?.waterway} />
    </>
  )
}

// PORTATIV POPUP KOMPONENTI
function WaterPopup({ feature }) {
  const props = feature.properties || {}
  const type = props.waterway || 'river'
  const config = WATER_CONFIGS[type] || WATER_CONFIGS.river

  // OSM ma'lumotlaridan nomlarni ajratib olish (agar topilmasa zaxira nom)
  const nameUz = props['name:uz'] || props.name || "Nomsiz suv ob'ekti"
  const nameRu = props['name:ru'] || props.name_ru || ""

  return (
    <div style={styles.popup}>
      <div style={styles.header}>
        <span style={{ fontSize: 22 }}>{config.icon}</span>
        <div>
          <p style={styles.title}>{nameUz}</p>
          <span style={{
            ...styles.typeBadge,
            background: config.color + '22',
            color: config.color,
          }}>
            {config.label}
          </span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.infoGrid}>
        <InfoRow icon="🔵" label="Turi (OSM)" value={type} />
        {props['@id'] && (
          <InfoRow icon="🆔" label="OSM ID" value={props['@id'].replace('/', ': ')} />
        )}
        {props.wikidata && (
          <InfoRow icon="🌍" label="Wikidata" value={props.wikidata} />
        )}
      </div>

      {nameRu && (
        <>
          <div style={styles.divider} />
          <p style={styles.nameRu}>Muqobil nomi: {nameRu}</p>
        </>
      )}
    </div>
  )
}

// AVTOMATIK LEGEND (Obyekt turiga qarab guruhlaydi)
function WaterLegend({ activeType }) {
  return (
    <div style={styles.legend}>
      <p style={styles.legendTitle}>Suv turlari</p>
      {Object.entries(WATER_CONFIGS).map(([key, config]) => (
        <div
          key={key}
          style={{
            ...styles.legendItem,
            opacity: activeType ? (activeType === key ? 1 : 0.35) : 1,
          }}
        >
          {/* Legend ichidagi chiziq stilini xaritadagiga moslash */}
          <div style={{
            ...styles.legendLine,
            borderBottom: `${config.weight}px ${config.dashArray ? 'dashed' : 'solid'} ${config.color}`,
            height: 0,
            paddingTop: 4
          }} />
          <span style={styles.legendLabel}>{config.label}</span>
        </div>
      ))}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={{ fontSize: 13, width: 18 }}>{icon}</span>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  )
}

// Eski chiroyli inline CSS stillaringiz o'zgarishsiz saqlanadi
const styles = {
  popup: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    minWidth: 240,
    padding: '4px 0',
  },
  header: {
    display: 'flex', alignItems: 'flex-start',
    gap: 10, marginBottom: 10,
  },
  title: {
    fontSize: 14, fontWeight: 600,
    color: '#1a1a1a', margin: '0 0 4px', lineHeight: 1.3,
  },
  typeBadge: {
    fontSize: 11, padding: '2px 7px',
    borderRadius: 10, fontWeight: 500,
  },
  divider: { height: 1, background: '#eee', margin: '10px 0' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: 6 },
  infoRow: { display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 },
  infoLabel: { color: '#888', flex: 1 },
  infoValue: { color: '#1a1a1a', fontWeight: 500, wordBreak: 'break-all' },
  nameRu: {
    fontSize: 11, color: '#666', margin: 0, fontStyle: 'italic',
  },
  legend: {
    position: 'absolute',
    bottom: 24,
    right: 12,
    background: 'white',
    border: '1px solid #eee',
    borderRadius: 8,
    padding: '10px 14px',
    zIndex: 500,
    minWidth: 180,
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
  },
  legendTitle: {
    fontSize: 11, color: '#999',
    fontWeight: 600, marginBottom: 10,
    textTransform: 'uppercase', letterSpacing: 0.5,
    margin: 0
  },
  legendItem: {
    display: 'flex', alignItems: 'center',
    gap: 10, marginTop: 8,
    transition: 'opacity 0.2s',
  },
  legendLine: {
    width: 30, flexShrink: 0,
  },
  legendLabel: { fontSize: 12, color: '#333', fontWeight: 500 },
}