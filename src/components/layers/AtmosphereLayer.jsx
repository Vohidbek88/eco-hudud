import { useState } from 'react';
import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import sirdaryoTumanlari from '../../data/sirdaryo-tumanlari.json'; // Tumanlar GeoJSON konturi
import { ATMOSPHERE_DATA } from '../../data/atmosphereData';
// Recharts elementlari
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { HiXMark, HiArrowTopRightOnSquare, HiChartBar } from 'react-icons/hi2';
import { Link } from 'react-router-dom';
import { renderToStaticMarkup } from 'react-dom/server';

export default function AtmosphereLayer() {
  // Endi faqat nom emas, obyekt saqlaymiz: { name, center, rawData }
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // Xaritadagi tumanlarni jami chiqindi miqdoriga qarab dinamik bo'yash
  const getStyle = (feature) => {
    const osmName = feature.properties?.name || feature.properties?.['name:uz'] || feature.properties?.['name:uz-cyr'] || feature.properties?.['name:en'] || feature.properties?.['name:ru'];

    const data = ATMOSPHERE_DATA[osmName];
    const jami = data ? data.jami2023 : 0;
    
    const isActive = selectedDistrict?.name === osmName;

    let fillColor = '#fef08a'; 
    if (jami > 30) fillColor = '#991b1b75';      
    else if (jami > 5) fillColor = '#dc26266c';  
    else if (jami > 3) fillColor = '#f9741673';  
    else if (jami > 2.5) fillColor = '#facc1575'; 

    return {
      fillColor: fillColor,
      weight: isActive ? 2.5 : 1.2,
      opacity: 1,
      color: isActive ? '#0f172a' : '#ffffff',
      fillOpacity: isActive ? 0.85 : 0.6,
    };
  };

  const onEachFeature = (feature, layer) => {
    const osmName = feature.properties?.name || feature.properties?.['name:uz'];
    const data = ATMOSPHERE_DATA[osmName];

    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        const bounds = e.target.getBounds();
        const center = bounds.getCenter(); // Hududning markaziy nuqtasi

        if (data) {
          setSelectedDistrict({
            name: osmName,
            center: center,
            rawData: data
          });
        }
      },
      mouseover: (e) => {
        const layer = e.target;
        layer.setStyle({ fillOpacity: 0.8 });
      },
      mouseout: (e) => {
        const layer = e.target;
        if (selectedDistrict?.name !== osmName) {
          layer.setStyle({ fillOpacity: 0.6 });
        }
      }
    });
  };

  const prepareChartData = (data) => {
    if (!data) return [];
    return [
      { name: '2022-yil', 'Transport': data.transport2022, 'Sanoat': data.sanoat2022 },
      { name: '2023-yil', 'Transport': data.transport2023, 'Sanoat': data.sanoat2023 }
    ];
  };

  // Dinamik o'zgarish foizini hisoblash funksiyasi
  const calculateChangePercent = (data) => {
    if (!data || !data.jami2022) return '0%';
    const change = ((data.jami2023 - data.jami2022) / data.jami2022) * 100;
    return `${change > 0 ? '+' : ''}${change.toFixed(1)}%`;
  };

  return (
    <>
      {/* Tuman konturlari */}
      <GeoJSON 
        key={selectedDistrict?.name || 'default'} // Aktiv tuman o'zgarganda xaritani yangilash
        data={sirdaryoTumanlari} 
        style={getStyle} 
        onEachFeature={onEachFeature} 
      />

      {/* 🟢 HUDUD USTIDA HAVODA SUZIB TURUVCHI DINAMIKA FOIZI (MARKER) */}
      {selectedDistrict && selectedDistrict.rawData && (
        <Marker
          position={selectedDistrict.center}
          icon={L.divIcon({
            html: `
              <div class="absolute -translate-x-1/2 -translate-y-1/2 bg-slate-900/90 text-white backdrop-blur-sm border border-slate-700/50 px-2.5 py-1.5 rounded-xl shadow-xl pointer-events-none select-none text-center min-w-[100px] animate-in fade-in zoom-in-95 duration-200 z-[1100]">
                <div class="text-[9px] font-bold text-slate-300 uppercase tracking-wider">O'zgarish</div>
                <div class="text-xs font-black ${
                  (selectedDistrict.rawData.jami2023 - selectedDistrict.rawData.jami2022) > 0 
                    ? 'text-rose-400' 
                    : 'text-emerald-400'
                }">
                  ${calculateChangePercent(selectedDistrict.rawData)}
                </div>
              </div>
            `,
            className: 'custom-hologram-emissions-icon',
            iconSize: [0, 0],
          })}
        />
      )}

      {/* --- TAILWIND MODERN SIDEBAR --- */}
      {selectedDistrict && selectedDistrict.rawData && (
        <div className="absolute top-5 left-5 w-80 bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-2xl p-5 z-[1000] font-sans animate-in fade-in slide-in-from-left-5 duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center mb-1">
            <h3 className="text-base font-black text-slate-900 tracking-tight m-0">
              {selectedDistrict.name}
            </h3>
            <button 
              onClick={() => setSelectedDistrict(null)} 
              className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>
          
          <p className="text-[11px] text-slate-400 font-medium leading-relaxed m-0 mb-3">
            Atmosferaga chiqarilgan zararli moddalar (ming tonna):
          </p>
          
          {/* 🔄 GORIZONTAL SCROLL VA SEMIZLASHTIRILGAN RECHARTS GRAFIK KONTEYNERI */}
          <div className="w-full overflow-x-auto pb-1 mb-3 border border-slate-100 bg-slate-50/50 rounded-xl p-1.5 scrollbar-thin">
            {/* Ustunlar semiz (qalin) bo'lishi uchun ichki div kengligi fixed 340px qilindi */}
            <div className="w-[340px] h-44">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={prepareChartData(selectedDistrict.rawData)} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
                  <XAxis dataKey="name" fontSize={10} tickLine={false} stroke="#64748b" fontWeight={700} />
                  <YAxis fontSize={10} tickLine={false} stroke="#64748b" fontWeight={600} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '10px', border: 'none', color: '#fff', fontSize: '10px' }}
                    formatter={(value) => [`${value} ming t`]}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 10, paddingTop: 4 }} />
                  {/* barSize 22px ga kengaytirilib, semiz holatga keltirildi */}
                  <Bar dataKey="Transport" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={22} name="Transport" />
                  <Bar dataKey="Sanoat" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={22} name="Sanoat" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="h-px bg-slate-100 my-3" />

          {/* Ma'lumotlar Taxlili jadvali */}
          <div className="flex flex-col gap-2.5 mb-4">
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
              <span>🗓️ 2022-yil Jami:</span>
              <strong className="text-slate-900 font-bold font-mono">
                {selectedDistrict.rawData.jami2022.toFixed(3)} ming t
              </strong>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
              <span>🗓️ 2023-yil Jami:</span>
              <strong className="text-slate-900 font-bold font-mono">
                {selectedDistrict.rawData.jami2023.toFixed(3)} ming t
              </strong>
            </div>
            
            <div className="flex justify-between items-center text-xs text-slate-600 font-semibold">
              <span>📈 O'zgarish dinamikasi:</span>
              <strong 
                className={`font-bold font-mono px-1.5 py-0.5 rounded ${
                  (selectedDistrict.rawData.jami2023 - selectedDistrict.rawData.jami2022) > 0 
                    ? 'bg-rose-50 text-rose-600' 
                    : 'bg-emerald-50 text-emerald-600'
                }`}
              >
                {(selectedDistrict.rawData.jami2023 - selectedDistrict.rawData.jami2022) > 0 ? '+' : ''}
                {(selectedDistrict.rawData.jami2023 - selectedDistrict.rawData.jami2022).toFixed(3)} ming t
              </strong>
            </div>
          </div>

          {/* --- BATAFSIL TAHLIL LINKI --- */}
          <Link 
            to={'/atmosphere'}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HiChartBar className="w-4 h-4 text-sky-400" />
              <span className='text-white text-xs'>Batafsil tahlil oynasi</span>
            </div>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>

        </div>
      )}
    </>
  );
}