import { useState } from 'react';
import { GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import sirdaryoTumanlari from '../../data/sirdaryo-tumanlari.json'; // Tumanlar GeoJSON konturi
import { ATMOSPHERE_DATA } from '../../data/atmosphereData';
// Recharts elementlari
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


export default function AtmosphereLayer() {
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  
  // Xaritadagi tumanlarni jami chiqindi miqdoriga qarab dinamik bo'yash
  const getStyle = (feature) => {
    const osmName = feature.properties?.name || feature.properties?.['name:uz'] || feature.properties?.['name:uz-cyr'] || feature.properties?.['name:en'] || feature.properties?.['name:ru'];


    const data = ATMOSPHERE_DATA[osmName];
    const jami = data ? data.jami2023 : 0;
    
    const isActive = selectedDistrict ==osmName

    // Chiqindi miqdoriga qarab ranglar (Shirin shahar uchun to'q qizil)
    let fillColor = '#fef08a'; 
    if (jami > 30) fillColor = '#991b1b75';      
    else if (jami > 5) fillColor = '#dc26266c';  
    else if (jami > 3) fillColor = '#f9741673';  
    else if (jami > 2.5) fillColor = '#facc1575'; 

    return {
      fillColor: fillColor,
      weight: isActive ? 3 : 1.5,
      opacity: 1,
      color: isActive ? '#1e293b' : '#fff', // Aktiv tumanni chegarasini to'q qilib ko'rsatish
      fillOpacity: isActive ? 0.85 : 0.6,
    };
  };

  const onEachFeature = (feature, layer) => {
    const osmName = feature.properties?.name || feature.properties?.['name:uz'];


    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e); // Xaritaning kliklanish hodisasini to'xtatadi
        setSelectedDistrict(osmName);
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ fillOpacity: 0.8 });
      },
      mouseout: (e) => {
        const layer = e.target;
        if (selectedDistrict !== osmName) {
          layer.setStyle({ fillOpacity: 0.6 });
        }
      }
    });
  };

  const prepareChartData = (name) => {
    const d = ATMOSPHERE_DATA[name];
    if (!d) return [];
    return [
      { name: '2022-yil', 'Transport': d.transport2022, 'Sanoat': d.sanoat2022 },
      { name: '2023-yil', 'Transport': d.transport2023, 'Sanoat': d.sanoat2023 }
    ];
  };

  return (
    <>
      {/* Tuman konturlari */}
      <GeoJSON 
        data={sirdaryoTumanlari} 
        style={getStyle} 
        onEachFeature={onEachFeature} 
      />

      {/* DINAMIK SIDEBAR */}
      {selectedDistrict && ATMOSPHERE_DATA[selectedDistrict] && (
        <div style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <h3 style={styles.sidebarTitle}>{selectedDistrict}</h3>
            <button 
              onClick={() => setSelectedDistrict(null)} 
              style={styles.closeButton}
            >
              ✕
            </button>
          </div>
          
          <p style={styles.sidebarSub}>Atmosferaga chiqarilgan zararli moddalar (ming tonna):</p>
          
          {/* RECHARTS GRAFIK */}
          <div style={styles.chartWrapper}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={prepareChartData(selectedDistrict)} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" fontSize={12} tickLine={false} />
                <YAxis fontSize={12} tickLine={false} />
                <Tooltip formatter={(value) => [`${value} ming t`]} />
                <Legend wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
                <Bar dataKey="Transport" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Sanoat" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.divider} />

          {/* Ma'lumotlar Taxlili jadvali */}
          <div style={styles.infoGrid}>
            <div style={styles.infoRow}>
              <span>🗓️ 2022-yil Jami:</span>
              <strong style={styles.val}>{ATMOSPHERE_DATA[selectedDistrict].jami2022} ming t</strong>
            </div>
            <div style={styles.infoRow}>
              <span>🗓️ 2023-yil Jami:</span>
              <strong style={styles.val}>{ATMOSPHERE_DATA[selectedDistrict].jami2023} ming t</strong>
            </div>
            <div style={styles.infoRow}>
              <span>📈 O'zgarish dinamikasi:</span>
              <strong style={{
                ...styles.val,
                color: (ATMOSPHERE_DATA[selectedDistrict].jami2023 - ATMOSPHERE_DATA[selectedDistrict].jami2022) > 0 ? '#ef4444' : '#22c55e'
              }}>
                {(ATMOSPHERE_DATA[selectedDistrict].jami2023 - ATMOSPHERE_DATA[selectedDistrict].jami2022).toFixed(3)} ming t
              </strong>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// SIDEBAR VA DIAGRAMMA UCHUN TAYYOR INTERFEYS STILLARI
const styles = {
  sidebar: {
    position: 'absolute',
    top: 20,
    left: 20,
    width: 320,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    borderRadius: 12,
    padding: 20,
    zIndex: 1000, // Xaritaning ustida turishi shart
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    backdropFilter: 'blur(8px)',
    border: '1px solid rgba(226, 232, 240, 0.8)'
  },
  sidebarHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6
  },
  sidebarTitle: {
    margin: 0,
    fontSize: 18,
    fontWeight: 700,
    color: '#0f172a',
    letterSpacing: '-0.025em'
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: 16,
    color: '#94a3b8',
    cursor: 'pointer',
    padding: 4,
    transition: 'color 0.2s',
    ':hover': { color: '#64748b' }
  },
  sidebarSub: {
    margin: '0 0 20px 0',
    fontSize: 12,
    color: '#64748b',
    lineHeight: 1.4
  },
  chartWrapper: {
    width: '100%',
    height: 220,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: '10px 0'
  },
  divider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    margin: '16px 0'
  },
  infoGrid: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    fontSize: 13,
    color: '#334155'
  },
  val: {
    fontWeight: 600,
    color: '#0f172a'
  }
};