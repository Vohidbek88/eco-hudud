import { useMemo, useState } from 'react'
import { GeoJSON, Marker, Polygon } from 'react-leaflet'
import L from 'leaflet'
import {AiFillCloseCircle} from "react-icons/ai"
import { WASTE_SITES } from '../../data/wasteData'
import sirdaryoDistrictsData from '../../data/sirdaryo-tumanlari.json'

const trashSvg = `
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M9 4h6l1 2h4v2H4V6h4l1-2Z" fill="currentColor"/>
    <path d="M6 9h12l-1 11H7L6 9Z" fill="currentColor"/>
  </svg>
`

const makeWasteIcon = (active) =>
  L.divIcon({
    className: '',
    html: `
      <div style="
        width: 38px; height: 38px;
        background: ${active ? '#b91c1c' : '#dc2626'};
        border: 3px solid rgba(255,255,255,0.92);
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex; align-items: center; justify-content: center;
        color: white;
        box-shadow: 0 8px 20px rgba(185,28,28,0.35);
        cursor: pointer;
      ">
        <span style="transform: rotate(45deg); display:flex;">${trashSvg}</span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 38],
  })

const activeBoundaryStyle = {
  color: '#dc2626',
  weight: 3,
  fillColor: '#dc2626',
  fillOpacity: 0.14,
  dashArray: '8 5',
}

const STATUS_COLOR = {
  Faol: '#27ae60',
  Yopiq: '#e74c3c',
  Remont: '#f39c12',
}

const DISTRICT_BOUNDARY_IDS = {
  'Guliston shahri': 'relation/8310445',
  'Yangiyer shahri': 'relation/11086479',
  'Xovos tumani': 'relation/11086994',
  'Mirzaobod tumani': 'relation/11087046',
  'Boyovut tumani': 'relation/11086477',
  'Сирдарё тумани': 'relation/11087876',
  'Сайхунобод тумани': 'relation/11087853',
  'Сардоба тумани': 'relation/11087239',
  'Оқолтин тумани': 'relation/11087238',
  'Гулистон тумани': 'relation/11087519',
  'Shirin': 'way/140375240',
}

function normalizeName(value) {
  return value
    ?.toLocaleLowerCase('uz-UZ')
    .replace(/\s+/g, ' ')
    .trim()
}

function getFeatureNames(feature) {
  const properties = feature.properties ?? {}

  return [
    properties.name,
    properties['name:uz-cyr'],
    properties['name:uz'],
    properties['name:en'],
    properties['name:ru'],
  ].filter(Boolean)
}

function getServedBoundaryData(site) {
  const districtNames = new Set([
    site.district,
    ...(site.servesDistricts ?? []),
  ].map(normalizeName))

  const boundaryIds = new Set([
    ...(site.servedBoundaryIds ?? []),
    ...(site.servesDistricts ?? [])
      .map((district) => DISTRICT_BOUNDARY_IDS[district])
      .filter(Boolean),
    DISTRICT_BOUNDARY_IDS[site.district],
  ].filter(Boolean))

  return {
    ...sirdaryoDistrictsData,
    features: sirdaryoDistrictsData.features.filter((feature) =>
      ['Polygon', 'MultiPolygon'].includes(feature.geometry?.type) &&
      (
        boundaryIds.has(feature.properties?.['@id'] ?? feature.id) ||
        getFeatureNames(feature).some((name) => districtNames.has(normalizeName(name)))
      )
    ),
  }
}

export default function WasteLayer({ activeId, onSelectSite }) {
  const activeSite = WASTE_SITES.find((site) => site.id === activeId)

  const servedBoundaryData = useMemo(() => {
    if (!activeSite) {
      return null
    }

    return getServedBoundaryData(activeSite)
  }, [activeSite])

  return (
    <>
      {servedBoundaryData?.features.length > 0 && (
        <GeoJSON
          key={activeSite.id}
          data={servedBoundaryData}
          style={activeBoundaryStyle}
        />
      )}

      {activeSite?.serviceAreaBoundaries?.map((boundary) => (
        <Polygon
          key={boundary.id}
          positions={boundary.coordinates}
          pathOptions={activeBoundaryStyle}
        />
      ))}

      {WASTE_SITES.map((site) => {
        const isActive = activeId === site.id

        return (
          <Marker
            key={site.id}
            position={[site.lat, site.lng]}
            icon={makeWasteIcon(isActive)}
            eventHandlers={{
              click: () => onSelectSite(isActive ? null : site.id),
            }}
          />
        )
      })}
    </>
  )
}

export function WasteDetailsSidebar({ site, onClose }) {
  if (!site) {
    return null
  }

  return (
    <aside className="waste-details-sidebar" aria-label="Chiqindi poligoni detallari">
      <button className="waste-details-close" type="button" onClick={onClose}>
        <AiFillCloseCircle size={24} aria-hidden="true" />  
      </button>

      <div className="waste-details-header">
        <span className="waste-details-icon" dangerouslySetInnerHTML={{ __html: trashSvg }} />
        <div>
          <h2>{site.district}</h2>
          <span className="waste-details-location">{ site.name}</span>
          <span
            className="waste-details-badge"
            style={{
              background: (STATUS_COLOR[site.status] ?? '#7f8c8d') + '22',
              color: STATUS_COLOR[site.status] ?? '#7f8c8d',
            }}
          >
            {site.status}
          </span>
        </div>
      </div>

      <div className="waste-details-divider" />

      <div className="waste-details-info">
        <InfoRow label="Quvvat" value={site.capacity} />
        <InfoRow label="Maydon" value={site.area} />
        <InfoRow label="Ochilgan" value={site.opened} />
      </div>

      <div className="waste-details-divider" />

      <p className="waste-details-section-title">Xizmat ko'rsatadigan hududlar</p>
      <ul className="waste-details-districts">
        {site.servesDistricts.map((district) => (
          <li key={district}>
            <span />
            {district}
          </li>
        ))}
      </ul>
    </aside>
  )
}

function InfoRow({ label, value }) {
  return (
    <div className="waste-details-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}
