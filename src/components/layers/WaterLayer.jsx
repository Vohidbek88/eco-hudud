import { useState, useEffect } from 'react'
import { GeoJSON } from 'react-leaflet'
import L from 'leaflet'
import sirdaryoWaterData from '../../data/sirdaryo-suv.json'

// Shimmer CSS animatsiyasini global ineksiya qilish
if (typeof document !== 'undefined') {
  const style = document.createElement('style')
  style.innerHTML = `
    @keyframes waterShimmer {
      0% { background-position: -200px 0; }
      100% { background-position: 200px 0; }
    }
    .water-shimmer {
      background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
      background-size: 200px 100%;
      animation: waterShimmer 1.5s infinite linear;
    }
  `
  document.head.appendChild(style)
}

// Suv obyektlari turlariga qarab boshlang'ich stillar
const WATER_CONFIGS = {
  river: { color: '#1d4ed8', weight: 3, label: 'Daryo', icon: '🌊' },
  canal: { color: '#2563eb', weight: 2.5, label: 'Kanal', icon: '🔲' },
  drain: { color: '#06b6d4', weight: 2, label: 'Kollektor / Zovur', icon: '➖', dashArray: '5 5' },
  ditch: { color: '#0ea5e9', weight: 1.5, label: 'Ariq / Zovur', icon: '➖', dashArray: '4 4' }
}

// ⭐️ GURUHLASH UCHUN ASOSIY KALIT: Obyektlarni bir-biriga bog'lash uchun eng ishonchli nom (Birlamchi: name:ru yoki name)
function extractGroupingKey(props) {
  if (!props) return null;

  const mainName = props.name || '';
  const intName = props.int_name || '';
  const nameRu = props['name:ru'] || props.name_ru || '';

  // Sirdaryo daryosi barcha bo'laklarini yagona zanjirga bog'lash
  if (mainName.includes('Sirdaryo') || mainName.includes('Сирдарё') || intName.includes('Sirdaryo') || nameRu.includes('Сырдарья')) {
    return 'Sirdaryo daryosi';
  }

  // Segmentlarni tutashtirish uchun eng ko'p to'ldirilgan name:ru yoki asosiy name kalitidan foydalanamiz
  const groupKey = props['name:ru'] || props.name || props.name_ru || props['name:uz'] || props['name:en'] || props.old_name;

  if (groupKey && typeof groupKey === 'string' && !groupKey.includes('-')) {
    return groupKey.trim().toLowerCase(); // Katta-kichik harflar farq qilmasligi uchun
  }

  return groupKey ? String(groupKey).trim().toLowerCase() : null;
}

// SIDEBARDA CHIROYLI KO'RSATISH UCHUN NOM (Birlamchi o'zbekcha, keyin ruscha)
function extractDisplayImgName(props) {
  if (!props) return null;
  return props['name:uz'] || props.name || props['name:ru'] || props['name:en'] || props.old_name;
}

export default function WaterLayer() {
  const [activeGroupKey, setActiveGroupKey] = useState(null)
  const [activeFeature, setActiveFeature] = useState(null) 
  const [hoveredFeatureId, setHoveredFeatureId] = useState(null)

  const getStyle = (feature) => {
    const type = feature.properties?.waterway || 'river'
    const config = WATER_CONFIGS[type] || WATER_CONFIGS.river
    
    const id = feature.properties?.['@id']
    const currentGroupKey = extractGroupingKey(feature.properties)
    
    // SMART FAOLLIK MANTIQI:
    // 1. Agar obyekt guruhlash kalitiga (name:ru / name) ega bo'lsa va u tanlangan bo'lsa -> Butun daryo tizimi yonadi.
    // 2. Agar butunlay nomsiz bo'lsa -> Faqat bosilgan yagona ID chizig'i yonadi.
    const isActive = (currentGroupKey && activeGroupKey && currentGroupKey === activeGroupKey) || 
                     (!currentGroupKey && activeFeature?.properties?.['@id'] === id);
                     
    const isHovered = hoveredFeatureId === id

    let currentWeight = config.weight
    if (isHovered) currentWeight += 1.5
    if (isActive) currentWeight += 3 

    return {
      color: config.color,
      weight: currentWeight,
      opacity: isActive ? 1 : (isHovered ? 0.95 : 0.55),
      dashArray: config.dashArray || null,
      fillOpacity: 0,
    }
  }

  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: (e) => {
        setHoveredFeatureId(feature.properties?.['@id'])
      },
      mouseout: () => {
        setHoveredFeatureId(null)
      },
      click: (e) => {
        L.DomEvent.stopPropagation(e)
        const groupKey = extractGroupingKey(feature.properties)
        
        setActiveGroupKey(groupKey) // Guruhlash endi name:ru yoki name asosida mukammal ishlaydi
        setActiveFeature(feature)
      }
    })
  }

  return (
    <>
      <GeoJSON
        key={activeFeature?.properties?.['@id'] || activeGroupKey || 'water-layer-reset'}
        data={sirdaryoWaterData}
        style={getStyle}
        onEachFeature={onEachFeature}
      />

      <WaterSidebar 
        feature={activeFeature} 
        onClose={() => { setActiveFeature(null); setActiveGroupKey(null); }} 
      />

      <WaterLegend activeType={activeFeature?.properties?.waterway} />
    </>
  )
}

// SIDEBAR KOMPONENTI
function WaterSidebar({ feature, onClose }) {
  const [wikiData, setWikiData] = useState({ 
    description: '', 
    image: '', 
    wikipediaUrl: '',
    country: '',
    loading: false 
  })
  
  const props = feature?.properties || {}
  const type = props.waterway || 'river'
  const config = WATER_CONFIGS[type] || WATER_CONFIGS.river
  
  // Sarlavha uchun chiroyli nom formatlash
  const detectedName = extractDisplayImgName(props)
  const nameUz = detectedName || `Nomsiz ${config.label.toLowerCase()}`

  useEffect(() => {
    if (!props.wikidata) {
      setWikiData({ description: '', image: '', wikipediaUrl: '', country: '', loading: false })
      return
    }

    const fetchWikidata = async () => {
      setWikiData(prev => ({ ...prev, loading: true }))
      try {
        const wikiId = props.wikidata
        const url = `https://www.wikidata.org/wiki/Special:EntityData/${wikiId}.json`
        const res = await fetch(url)
        const json = await res.json()
        
        const entity = json.entities[wikiId]
        
        // Wikidata tavsifi
        const description = entity.descriptions?.uz?.value || 
                            entity.descriptions?.ru?.value || 
                            entity.descriptions?.en?.value || 
                            `Ushbu ${config.label.toLowerCase()} haqida global ma'lumotlar bazasida qo'shimcha matn mavjud emas.`;

        // Wikipedia havolasi
        let wikipediaUrl = ''
        if (entity.sitelinks?.uzwiki) wikipediaUrl = entity.sitelinks.uzwiki.url
        else if (entity.sitelinks?.ruwiki) wikipediaUrl = entity.sitelinks.ruwiki.url
        else if (entity.sitelinks?.enwiki) wikipediaUrl = entity.sitelinks.enwiki.url

        // Hududiy joylashuv (P17)
        let country = "O'zbekiston"
        const countryClaim = entity.claims?.P17?.[0]
        if (countryClaim && countryClaim.mainsnak?.datavalue?.value?.id === 'Q265') {
          country = "O'zbekiston (Sirdaryo viloyati)"
        }

        // Rasm url manzilini aniqlash
        let image = ''
        const imageClaim = entity.claims?.P18?.[0]
        if (imageClaim && imageClaim.mainsnak?.datavalue?.value) {
          const fileName = imageClaim.mainsnak.datavalue.value.replace(/\s/g, '_')
          image = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(fileName)}?width=400`
        }

        setWikiData({ description, image, wikipediaUrl, country, loading: false })
      } catch (error) {
        console.error("Wikidata yuklash xatosi:", error)
        setWikiData({ description: "Tarmoq xatosi tufayli ma'lumot yuklanmadi.", image: '', wikipediaUrl: '', country: '', loading: false })
      }
    }

    fetchWikidata()
  }, [props.wikidata, config.label])

  return (
    <div style={{
      ...styles.sidebar,
      transform: feature ? 'translateX(0)' : 'translateX(-110%)',
      opacity: feature ? 1 : 0
    }}>
      {feature ? (
        <>
          {/* Header */}
          <div style={styles.sbHeader}>
            <div style={styles.sbTitleBlock}>
              <span style={{ fontSize: 26 }}>{config.icon}</span>
              <div style={{ width: '82%' }}>
                <h3 style={styles.sbTitle}>{nameUz}</h3>
                <span style={{ ...styles.typeBadge, background: config.color + '15', color: config.color }}>
                  {config.label}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={styles.sbCloseBtn}>&times;</button>
          </div>

          <div style={styles.sbDivider} />

          {wikiData.loading ? (
            <div style={styles.skeletonContainer}>
              <div style={{ ...styles.skeletonImage, className: 'water-shimmer' }} className="water-shimmer" />
              <div style={{ ...styles.skeletonLine, className: 'water-shimmer' }} className="water-shimmer" />
              <div style={{ ...styles.skeletonLine, width: '80%' }} className="water-shimmer" />
            </div>
          ) : (
            <div style={styles.scrollableContent}>
              {/* Rasm bloki */}
              {wikiData.image ? (
                <div style={styles.sbImageWrapper}>
                  <img src={wikiData.image} alt={nameUz} style={styles.sbImage} />
                </div>
              ) : (
                <div style={styles.noImagePlaceholder}>
                  <span>📸 Geografik rasm biriktirilmagan</span>
                </div>
              )}

              {/* Wikidata Eko-ta'rif */}
              <div style={styles.sbWikiDesc}>
                <p style={styles.sectionTitle}>🌍 EKO-TA'RIF</p>
                <p style={styles.descText}>{wikiData.description}</p>
              </div>

              {/* Tashqi Link Tugmalari */}
              <div style={styles.linkButtonGroup}>
                {wikiData.wikipediaUrl && (
                  <a href={wikiData.wikipediaUrl} target="_blank" rel="noreferrer" style={styles.wikiBtn}>
                    <span>📖</span> Wikipedia maqolasi
                  </a>
                )}
                {props.wikidata && (
                  <a href={`https://www.wikidata.org/wiki/${props.wikidata}`} target="_blank" rel="noreferrer" style={styles.dataBtn}>
                    <span>⚛️</span> Wikidata profili
                  </a>
                )}
              </div>

              <div style={styles.sbDivider} />

              {/* Nomlar registri bo'limi */}
              {(props['name:ru'] || props.old_name || props['name:en'] || props.name) && (
                <div style={styles.alternativeNamesBlock}>
                  <p style={styles.sectionTitle}>📝 Nomlar registri</p>
                  <div style={styles.infoGrid}>
                    {props.name && <InfoRow icon="🇺🇿" label="Asosiy tegi (OSM)" value={props.name} />}
                    {props['name:ru'] && <InfoRow icon="🇷🇺" label="Ruscha nomi" value={props['name:ru']} />}
                    {props['name:en'] && <InfoRow icon="🇺🇸" label="Inglizcha nomi" value={props['name:en']} />}
                    {props.old_name && <InfoRow icon="⏳" label="Eski / Tarixiy nomi" value={props.old_name} />}
                  </div>
                  <div style={styles.sbDivider} />
                </div>
              )}

              {/* GIS Metriklari */}
              <div>
                <p style={styles.sectionTitle}>📊 GIS Metriklari</p>
                <div style={styles.infoGrid}>
                  <InfoRow icon="📍" label="Joylashuv hududi" value={wikiData.country || "Sirdaryo viloyati"} />
                  <InfoRow icon="🔑" label="Tizim kodi (OSM)" value={type} />
                  {props['@id'] && <InfoRow icon="🆔" label="Obyekt ID (OSM)" value={props['@id']} />}
                </div>
              </div>
            </div>
          )}
          
          <div style={styles.sbFooter}>
            <p>Sirdaryo ekologik monitoring gidrologiya tizimi.</p>
          </div>
        </>
      ) : null}
    </div>
  )
}

function WaterLegend({ activeType }) {
  return (
    <div style={styles.legend}>
      <p style={styles.legendTitle}>Suv turlari</p>
      {Object.entries(WATER_CONFIGS).map(([key, config]) => (
        <div key={key} style={{ ...styles.legendItem, opacity: activeType ? (activeType === key ? 1 : 0.35) : 1 }}>
          <div style={{
            ...styles.legendLine,
            borderBottom: `${config.weight}px ${config.dashArray ? 'dashed' : 'solid'} ${config.color}`,
            height: 0, paddingTop: 4
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

// STYLES SHEET
const styles = {
  sidebar: {
    position: 'absolute',
    top: 20, left: 20, bottom: 20,
    width: '350px',
    background: 'rgba(255, 255, 255, 0.96)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)',
    borderRadius: '20px',
    zIndex: 1000,
    padding: '24px 20px',
    display: 'flex', flexDirection: 'column',
    transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease',
    border: '1px solid rgba(226, 232, 240, 0.8)',
  },
  scrollableContent: { display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto', flex: 1, paddingRight: '4px' },
  sbHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' },
  sbTitleBlock: { display: 'flex', gap: 12, alignItems: 'flex-start', flex: 1 },
  sbTitle: { fontSize: 17, fontWeight: 700, color: '#0f172a', margin: '0 0 6px 0', lineHeight: 1.3, letterSpacing: '-0.3px' },
  sbCloseBtn: { background: '#f1f5f9', border: 'none', fontSize: 18, width: 28, height: 28, borderRadius: '50%', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', outline: 'none' },
  typeBadge: { fontSize: 11, padding: '4px 10px', borderRadius: '8px', fontWeight: 700, display: 'inline-block' },
  sbDivider: { height: 1, background: '#e2e8f0', margin: '14px 0', flexShrink: 0 },
  sectionTitle: { fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8, marginTop: 0 },
  descText: { fontSize: 13, color: '#334155', lineHeight: 1.5, margin: 0 },
  sbImageWrapper: { width: '100%', height: '160px', borderRadius: '14px', overflow: 'hidden', background: '#f8fafc' },
  sbImage: { width: '100%', height: '100%', objectFit: 'cover' },
  noImagePlaceholder: { width: '100%', padding: '20px 0', borderRadius: '14px', background: '#f8fafc', border: '1px dashed #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 12 },
  sbWikiDesc: { background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #f1f5f9' },
  linkButtonGroup: { display: 'flex', flexDirection: 'column', gap: 8, marginTop: 4 },
  wikiBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: '#1e293b', color: '#ffffff', borderRadius: '12px', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  dataBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '10px', background: '#ffffff', color: '#0284c7', border: '1px solid #e2e8f0', borderRadius: '12px', fontSize: 13, fontWeight: 600, textDecoration: 'none' },
  skeletonContainer: { display: 'flex', flexDirection: 'column', gap: 12, flex: 1 },
  skeletonImage: { width: '100%', height: '160px', borderRadius: '14px' },
  skeletonLine: { width: '100%', height: '14px', borderRadius: '4px' },
  alternativeNamesBlock: { display: 'flex', flexDirection: 'column' },
  infoGrid: { display: 'flex', flexDirection: 'column', gap: 8 },
  infoRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, borderBottom: '1px solid #f8fafc', paddingBottom: '6px' },
  infoLabel: { color: '#64748b', flex: 1 },
  infoValue: { color: '#0f172a', fontWeight: 600, wordBreak: 'break-all' },
  sbFooter: { marginTop: 'auto', paddingTop: '16px', fontSize: 11, color: '#94a3b8', fontStyle: 'italic', borderTop: '1px solid #f1f5f9' },
  legend: { position: 'absolute', bottom: 24, right: 12, background: 'white', border: '1px solid #eee', borderRadius: 8, padding: '10px 14px', zIndex: 500, minWidth: 180, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' },
  legendTitle: { fontSize: 11, color: '#999', fontWeight: 600, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.5, margin: 0 },
  legendItem: { display: 'flex', alignItems: 'center', gap: 10, marginTop: 8, transition: 'opacity 0.2s' },
  legendLine: { width: 30, flexShrink: 0 },
  legendLabel: { fontSize: 12, color: '#333', fontWeight: 500 }
}