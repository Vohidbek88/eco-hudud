import { useState } from 'react'
import { GeoJSON, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { WATER_OBJECTS } from '../../data/waterData'
import sirdaryoData from '../../data/sirdaryo.json'

// GeoJSON dan faqat kerakli way-larni filter qilamiz
function filterFeatures(geojson, osmIds) {
  return {
    ...geojson,
    features: geojson.features.filter((f) =>
      osmIds.includes(f.properties?.['@id'])
    ),
  }
}

export default function WaterLayer() {
  const [activeObj, setActiveObj] = useState(null)
  const [popupPos, setPopupPos] = useState(null)

  const handleClick = (obj, e) => {
    setActiveObj(obj)
    setPopupPos(e.latlng)
  }

  return (
    <>
      {WATER_OBJECTS.map((obj) => {
        const filtered = filterFeatures(sirdaryoData, obj.osmIds)
        const isActive = activeObj?.id === obj.id

        return (
          <GeoJSON
            key={obj.id}
            data={filtered}
            style={{
              color: obj.color,
              weight: isActive ? obj.weight + 2 : obj.weight,
              opacity: isActive ? 1 : 0.8,
              fillOpacity: 0,
            }}
            eventHandlers={{
              click: (e) => handleClick(obj, e),
            }}
          />
        )
      })}

      {/* Popup — active ob'ekt uchun */}
      {activeObj && popupPos && (
        <Popup
          position={popupPos}
          onClose={() => { setActiveObj(null); setPopupPos(null) }}
          maxWidth={280}
        >
          <WaterPopup obj={activeObj} />
        </Popup>
      )}

      {/* Legend */}
      <WaterLegend active={activeObj} />
    </>
  )
}

function WaterPopup({ obj }) {
  return (
    <div style={styles.popup}>
      <div style={styles.header}>
        <span style={{ fontSize: 22 }}>{obj.typeIcon}</span>
        <div>
          <p style={styles.title}>{obj.name}</p>
          <span style={{
            ...styles.typeBadge,
            background: obj.color + '22',
            color: obj.color,
          }}>
            {obj.type}
          </span>
        </div>
      </div>

      <div style={styles.divider} />

      <div style={styles.infoGrid}>
        <InfoRow icon="📏" label="Uzunlik" value={obj.lengthInRegion} />
        <InfoRow icon="🔵" label="Turi" value={obj.type} />
        {obj.wikidata && (
          <InfoRow icon="🌍" label="Wikidata" value={obj.wikidata} />
        )}
      </div>

      <div style={styles.divider} />

      <p style={styles.description}>{obj.description}</p>

      {obj.nameRu && (
        <p style={styles.nameRu}>{obj.nameRu}</p>
      )}
    </div>
  )
}

// Xarita pastki o'ng burchagidagi legend
function WaterLegend({ active }) {
  return (
    <div style={styles.legend}>
      <p style={styles.legendTitle}>Suv ob'ektlari</p>
      {WATER_OBJECTS.map((obj) => (
        <div
          key={obj.id}
          style={{
            ...styles.legendItem,
            opacity: active ? (active.id === obj.id ? 1 : 0.45) : 1,
          }}
        >
          <div style={{
            ...styles.legendLine,
            background: obj.color,
            height: obj.weight + 1,
          }} />
          <span style={styles.legendLabel}>{obj.name}</span>
        </div>
      ))}
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div style={styles.infoRow}>
      <span style={{ fontSize: 14, width: 20 }}>{icon}</span>
      <span style={styles.infoLabel}>{label}</span>
      <span style={styles.infoValue}>{value}</span>
    </div>
  )
}

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
    fontSize: 13, fontWeight: 600,
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
  infoValue: { color: '#1a1a1a', fontWeight: 500 },
  description: {
    fontSize: 12, color: '#555', lineHeight: 1.5, margin: 0,
  },
  nameRu: {
    fontSize: 11, color: '#aaa', marginTop: 6, fontStyle: 'italic',
  },
  legend: {
    position: 'absolute',
    bottom: 40, right: 12,
    background: 'white',
    border: '1px solid #eee',
    borderRadius: 8,
    padding: '8px 12px',
    zIndex: 500,
    minWidth: 200,
  },
  legendTitle: {
    fontSize: 11, color: '#999',
    fontWeight: 600, marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  legendItem: {
    display: 'flex', alignItems: 'center',
    gap: 8, marginBottom: 5,
    transition: 'opacity 0.2s',
  },
  legendLine: {
    width: 24, borderRadius: 2, flexShrink: 0,
  },
  legendLabel: { fontSize: 12, color: '#333' },
}