import { useMemo,useState } from 'react'
import { GeoJSON, Marker, Polygon } from 'react-leaflet'
import L from 'leaflet'
import { AiOutlineClose, AiOutlineInfoCircle } from 'react-icons/ai'
import { FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import { FaTrashRestoreAlt, FaVectorSquare, FaCalendarAlt, FaBuilding, FaMapMarkerAlt } from 'react-icons/fa'
import { WASTE_SITES } from '../../data/wasteData'
import sirdaryoDistrictsData from '../../data/sirdaryo-tumanlari.json'
import '../../styles/waste-sidebar.css' // Yangi CSS faylimiz

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
        transition: all 0.2s ease;
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
  fillOpacity: 0.12,
  dashArray: '6 4',
}

const STATUS_COLOR = {
  'Фоалиятда': '#27ae60',
  'Faol': '#27ae60',
  'Yopiq': '#e74c3c',
  'Remont': '#f39c12',
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
  'Ширин шаҳар': 'way/140375240',
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
    site.ShaharTuman,
    ...(site.servesDistricts ?? []),
  ].map(normalizeName))

  const boundaryIds = new Set([
    ...(site.servedBoundaryIds ?? []),
    ...(site.servesDistricts ?? [])
      .map((district) => DISTRICT_BOUNDARY_IDS[district])
      .filter(Boolean),
    DISTRICT_BOUNDARY_IDS[site.ShaharTuman],
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
    if (!activeSite) return null
    return getServedBoundaryData(activeSite)
  }, [activeSite])

  return (
    <>
      {servedBoundaryData?.features.length > 0 && (
        <GeoJSON
          key={activeId}
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
  if (!site) return null

  const [copied, setCopied] = useState(false);

  const currentStatus = site.izoh || site.status || "Nomalum"

  const handleShare = async () => {
    // Google Maps koordinata havolasi (Eng universal havola)
    const googleMapsUrl = `https://www.google.com/maps?q=${site.lat},${site.lng}`;
    const shareText = `📍 ${site.ShaharTuman}, ${site.foydalanuvchiShaharTumanNomi}.`;

    // Agar foydalanuvchi smartfonda bo'lsa va brauzer qo'llab-quvvatlasa (Telegram/Viber/SMS orqali ulashish)
    if (navigator.share) {
      try {
        await navigator.share({
          title: site.ShaharTuman,
          text: shareText,
          url: googleMapsUrl,
        });
      } catch (error) {
        console.log("Ulashishda xatolik yoki foydalanuvchi bekor qildi:", error);
      }
    } else {
      // Agar kompyuterda bo'lsa - havolani clipboardga (buferga) ko'chirib qo'yadi
      try {
        await navigator.clipboard.writeText(`${shareText} ${googleMapsUrl}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // 2 soniyadan keyin tugma asliga qaytadi
      } catch (err) {
        alert("Havolani nusxalashda xatolik yuz berdi.");
      }
    }
  };

  return (
    <aside className="waste-details-sidebar" aria-label="Chiqindi poligoni detallari">
      {/* Sidebar Tepa qismi */}
      <div className="sidebar-header">
        <div>
          <h2>{site.ShaharTuman || 'Sirdaryo'}</h2>
          <span className="sidebar-subtitle">{site.foydalanuvchiShaharTumanNomi}</span>
        </div>
        <button className="sidebar-close-btn" type="button" onClick={onClose} title="Yopish">
          <AiOutlineClose size={20} />
        </button>
      </div>

      {/* Scroll bo'ladigan asosiy tana qismi */}
      <div className="sidebar-body">
        
        {/* Status va Umumiy nuqta */}
        <div className="info-card status-card">
          <span
            className="status-badge"
            style={{
              background: (STATUS_COLOR[currentStatus] ?? '#7f8c8d') + '18',
              color: STATUS_COLOR[currentStatus] ?? '#7f8c8d',
            }}
          >
            <span className="status-dot" style={{ background: STATUS_COLOR[currentStatus] ?? '#7f8c8d' }} />
            {currentStatus}
          </span>
          <div className="mfy-info">
            <FaMapMarkerAlt /> <span><b>MFY/Joy:</b> {site.MFY}</span>
          </div>

          <button 
            type="button" 
            className={`sidebar-share-btn ${copied ? 'copied' : ''}`}
            onClick={handleShare}
          >
            {copied ? (
              <>
                <FiCheck size={16} /> <span>Havola nusxalandi!</span>
              </>
            ) : (
              <>
                <FiShare2 size={16} /> <span>Geolokatsiyani ulashish</span>
              </>
            )}
          </button>

        </div>

        {/* 1-Bo'lim: Texnik ko'rsatkichlar */}
        <div className="sidebar-section">
          <h3><AiOutlineInfoCircle /> Texnik ko'rsatkichlar</h3>
          <div className="info-grid">
            <InfoBox icon={<FaVectorSquare />} label="Umumiy maydon" value={`${site.maydoniGa} GA`} />
            <InfoBox icon={<FaCalendarAlt />} label="Ishga tushgan" value={site.ishgaTushirilganSanasi} />
            <InfoBox icon={<FaTrashRestoreAlt />} label="Jami to'plangan" value={`${site.toplanganMaishiyChiqindiMiqdoriTn?.toLocaleString()} tn`} />
            <InfoBox icon={<FaTrashRestoreAlt />} label="Yillik hajm" value={`${site.birYildaChiqarilganChiqindiMiqdoriTn?.toLocaleString()} tn/yil`} />
          </div>
          <div className="single-row-info">
            <span>Sanitariya himoya zonasi:</span>
            <strong>{site.sanitariyaHimoyaZonasiMavjudligiKm} km</strong>
          </div>
        </div>

        {/* 2-Bo'lim: Balansda saqlovchi */}
        <div className="sidebar-section">
          <h3><FaBuilding /> Yuridik boshqaruv</h3>
          <div className="legal-card">
            <p className="legal-title">{site.Egalik_qiluvchining_nomi}</p>
            <p className="legal-address"><b>Manzil:</b> {site.Egalik_qiluvchining_manzili}</p>
            <div className="expert-badge">
              Ekologik ekspertiza: <span>{site.davlatEkologikEkspertizasiTuriRaqamiSanasi}</span>
            </div>
          </div>
        </div>

        {/* 3-Bo'lim: Xizmat ko'rsatadigan hududlar */}
        <div className="sidebar-section">
          <h3>Xizmat ko'rsatadigan hududlar</h3>
          <ul className="served-districts-list">
            {site.servesDistricts?.map((district) => (
              <li key={district}>
                <span className="district-bullet" />
                {district}
              </li>
            ))}
          </ul>
        </div>

      </div>
    </aside>
  )
}

function InfoBox({ icon, label, value }) {
  return (
    <div className="info-box">
      <div className="info-box-icon">{icon}</div>
      <div className="info-box-content">
        <span className="info-box-label">{label}</span>
        <strong className="info-box-value">{value}</strong>
      </div>
    </div>
  )
}