import { useState } from 'react';
import { GeoJSON, Marker } from 'react-leaflet';
import L from 'leaflet';
import { FaCalendar, FaCloudSun } from 'react-icons/fa6';
import { HiArrowTopRightOnSquare, HiChartBar, HiXMark } from 'react-icons/hi2';
// Recharts elementlari
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { renderToStaticMarkup } from 'react-dom/server';

// Yangi nested JSON data
import YASHIL_MAKON_NESTED_DATA from '../../data/yashil_makon_nested_finalv1.json';
import { Link } from 'react-router-dom';

export default function YashilMakonLayer({ sirdaryoDistrictsGeoJSON }) {
  // Global filtrlar: standart holatda 2024-yil va Bahor mavsumi tanlangan bo'ladi
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedSeason, setSelectedSeason] = useState('Bahorda'); // 'Bahorda' yoki 'Kuzda'
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  // GeoJSON nomlarini JSON datadagi nomlarga moslash uchun yordamchi funksiya
  const findDistrictData = (geoJsonName) => {
    let cleanName = String(geoJsonName).trim();
    if (!cleanName.toLowerCase().includes('tumani') && !cleanName.toLowerCase().includes('shahri')) {
      cleanName = `${cleanName} Tumani`;
    }
    return YASHIL_MAKON_NESTED_DATA.find(
      (d) => d.tumanShaharNomi.toLowerCase() === cleanName.toLowerCase()
    );
  };

  // DINAMIK RANG BERISH (Tanlangan Yil va Mavsum foiziga qarab xarita bo'yaladi)
  const getColor = (percent) => {
    if (!percent) return '#cbd5e1'; 
    return percent >= 102 ? '#15803d' : // To'q yashil (Reja oshig'i bilan)
           percent >= 100 ? '#16a34a' : // Yashil
           percent >= 95  ? '#22c55e' : // Och yashil
                            '#f59e0b'; // Reja orqada bo'lsa sariq/olovrang
  };

  // LEAFLET STYLE FUNKSIYASI
  const styleFeature = (feature) => {
    const districtName = feature.properties.name_uz || feature.properties.name;
    const districtData = findDistrictData(districtName);
    
    const currentPercent = districtData?.[selectedSeason]?.[selectedYear]?.foizda || 0;
    const isCurrentSelected = selectedDistrict?.name === districtData?.tumanShaharNomi;

    return {
      fillColor: getColor(currentPercent),
      fillOpacity: isCurrentSelected ? 0.8 : 0.5,
      color: isCurrentSelected ? '#ef4444' : '#ffffff',
      weight: isCurrentSelected ? 3 : 1.2,
    };
  };

  // EVENTLAR (CLICK VA HOVER MANTIG'I)
  const onEachFeature = (feature, layer) => {
    const districtName = feature.properties.name_uz || feature.properties.name;
    const districtData = findDistrictData(districtName);

    layer.on({
      click: (e) => {
        L.DomEvent.stopPropagation(e);
        const bounds = e.target.getBounds();
        const center = bounds.getCenter();

        if (districtData) {
          setSelectedDistrict({
            name: districtData.tumanShaharNomi,
            center: center,
            rawData: districtData
          });
        }
        e.target._map.setView(center, e.target._map.getZoom(), { animate: true });
      },
      mouseover: (e) => {
        e.target.setStyle({ fillOpacity: 0.75, weight: 2 });
      },
      mouseout: (e) => {
        const dData = findDistrictData(feature.properties.name_uz || feature.properties.name);
        if (selectedDistrict?.name !== dData?.tumanShaharNomi) {
          e.target.setStyle({ fillOpacity: 0.5, weight: 1.2 });
        }
      }
    });
  };

  // ASOSIY PANELDAGI RECHARTS GRAFIGI UCHUN DATANI FORMATLASH
  const prepareChartData = (districtRawData) => {
    if (!districtRawData || !districtRawData[selectedSeason]) return [];
    
    const seasonData = districtRawData[selectedSeason];
    return Object.keys(seasonData).map((year) => ({
      year: `${year}-y`,
      'Topshiriq': parseFloat(seasonData[year].topshiriqberildi.toFixed(1)),
      'Amalda ekildi': parseFloat(seasonData[year].amalgaoshirildi.toFixed(1))
    }));
  };

  const currentSeasonAndYearData = selectedDistrict?.rawData?.[selectedSeason]?.[selectedYear];

  return (
    <>
      {/* Global Filtrlar Paneli */}
      <div className="absolute top-6 right-20 bg-white/90 backdrop-blur-md border border-slate-200/80 px-4 py-2.5 rounded-2xl shadow-xl z-[1000] flex items-center gap-4 font-sans text-xs font-bold">
        <div className="flex items-center gap-1.5 text-slate-500">
          <FaCalendar className="text-blue-500 w-3.5 h-3.5" />
          <span>Yil:</span>
          <select 
            value={selectedYear} 
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-800 font-extrabold focus:outline-none cursor-pointer"
          >
            <option value="2023">2023</option>
            <option value="2024">2024</option>
            <option value="2025">2025</option>
            <option value="2026">2026</option>
          </select>
        </div>

        <div className="h-4 w-px bg-slate-200" />

        <div className="flex items-center gap-1.5 text-slate-500">
          <FaCloudSun className="text-amber-500 w-4 h-4" />
          <span>Mavsum:</span>
          <select 
            value={selectedSeason} 
            onChange={(e) => setSelectedSeason(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg p-1 text-slate-800 font-extrabold focus:outline-none cursor-pointer"
          >
            <option value="Bahorda">🌿 Bahor</option>
            <option value="Kuzda">🍁 Kuz</option>
          </select>
        </div>
      </div>

      {/* Xaritadagi GeoJSON Qatlami */}
      {sirdaryoDistrictsGeoJSON && (
        <GeoJSON 
          key={`${selectedYear}-${selectedSeason}`}
          data={sirdaryoDistrictsGeoJSON} 
          style={styleFeature} 
          onEachFeature={onEachFeature} 
        />
      )}

      {/* AYNAN HUDUD USTIDAGI HOLOGRAMMA CHART */}
      {selectedDistrict && currentSeasonAndYearData && (
        <Marker 
          position={selectedDistrict.center}
          icon={L.divIcon({
            html: `
              <div class="absolute -translate-x-1/2 -translate-y-1/2 w-48  p-2 pointer-events-none select-none text-center shadow-lg animate-in fade-in zoom-in-95 duration-300">
                <div class="text-[10px] font-black tracking-wider text-slate-900 uppercase mb-0.5">
                  ${selectedDistrict.name}
                </div>
                <div class="text-xs font-black text-black mb-1">
                  Bajarilishi: ${currentSeasonAndYearData?.foizda ? currentSeasonAndYearData.foizda.toFixed(1) + '%' : '0%'}
                </div>
                <div id="hologram-chart-box" class="w-full h-16 bg-transparent"></div>
              </div>
            `,
            className: 'custom-hologram-layer-icon',
            iconSize: [0, 0],
          })}
          eventHandlers={{
            add: (e) => {
              setTimeout(() => {
                const container = document.getElementById('hologram-chart-box');
                if (container) {
                  container.innerHTML = renderToStaticMarkup(
                    <div style={{ width: '100%', height: '100%', background: 'transparent' }}>
                      <BarChart 
                        width={160} 
                        height={60} 
                        data={[{
                          name: selectedYear,
                          'Rejada': currentSeasonAndYearData.topshiriqberildi,
                          'Amalda': currentSeasonAndYearData.amalgaoshirildi
                        }]}
                        margin={{ top: 2, right: 2, left: 2, bottom: 2 }}
                      >
                        <Bar dataKey="Rejada" fill="#94a3b8" radius={[2, 2, 0, 0]} barSize={12} />
                        <Bar dataKey="Amalda" fill="#10b981" radius={[2, 2, 0, 0]} barSize={12} />
                      </BarChart>
                    </div>
                  );
                }
              }, 30);
            }
          }}
        />
      )}

      {/* --- DOIMIY TURUVCHI CHAP PANEL (SCROLLABLE CHART BILAN) --- */}
      {selectedDistrict && (
        <div className="absolute top-24 left-6 w-80 sm:w-[360px] bg-white/90 backdrop-blur-xl border border-slate-200/60 rounded-3xl shadow-2xl p-5 z-[1000] font-sans animate-in fade-in slide-in-from-left-8 duration-300">
          
          {/* Header */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
            <div>
              <h4 className="text-base font-black text-slate-900 m-0 tracking-tight">{selectedDistrict.name}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0 mt-0.5">
                {selectedSeason === 'Bahorda' ? '🌿 Bahorgi' : '🍁 Kuzgi'} Mavsum Hisoboti
              </p>
            </div>
            <button 
              onClick={() => setSelectedDistrict(null)}
              className="p-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 text-slate-400 hover:text-slate-700 rounded-xl transition-colors cursor-pointer"
            >
              <HiXMark className="w-4 h-4" />
            </button>
          </div>

          {/* Progress bar */}
          <div className="space-y-3 mb-5">
            <div className="flex justify-between items-baseline">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wide">{selectedYear}-yil Reja bajarilishi</span>
              <span className={`text-xl font-black ${currentSeasonAndYearData?.foizda >= 100 ? 'text-emerald-600' : 'text-amber-500'}`}>
                {currentSeasonAndYearData?.foizda ? `${currentSeasonAndYearData.foizda.toFixed(1)}%` : '0%'}
              </span>
            </div>
            <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/30">
              <div 
                className={`h-full rounded-full transition-all duration-700 ${currentSeasonAndYearData?.foizda >= 100 ? 'bg-emerald-600' : 'bg-amber-500'}`}
                style={{ width: `${Math.min(currentSeasonAndYearData?.foizda || 0, 100)}%` }}
              />
            </div>
          </div>

          {/* Yillar kesimida dinamika sarlavhasi */}
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Yillar kesimida dinamika (O'ngga suring ➡️)
          </p>
          
          {/* 🔄 GORIZONTAL SCROLL KONTEYNERI */}
          <div className="w-full overflow-x-auto pb-2 mb-4 border border-slate-100 bg-slate-50/50 rounded-2xl p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {/* Ichki kenglikni 4 ta yil erkin sig'ishi uchun 420px qilib belgilaymiz */}
            <div className="w-[420px] h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart 
                  data={prepareChartData(selectedDistrict.rawData)} 
                  margin={{ top: 10, right: 5, left: -25, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
                  <XAxis dataKey="year" fontSize={11} tickLine={false} stroke="#64748b" fontWeight={700} />
                  <YAxis fontSize={11} tickLine={false} stroke="#64748b" fontWeight={600} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '11px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend iconSize={8} wrapperStyle={{ fontSize: 11, paddingTop: 4 }} />
                  <Bar dataKey="Topshiriq" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={16} name="Reja" />
                  <Bar dataKey="Amalda ekildi" fill="#10b981" radius={[4, 4, 0, 0]} barSize={16} name="Amal" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Batafsil havola */}
          <Link
            to={'/green-place'}
            className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10 active:scale-[0.98] group cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <HiChartBar className="w-4 h-4" />
              <span className=' text-xs text-white'>Batafsil tahlil oynasi</span>
            </div>
            <HiArrowTopRightOnSquare className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
          </Link>

        </div>
      )}
    </>
  );
}