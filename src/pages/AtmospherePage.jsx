import React, { useState } from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  FaWind, FaIndustry, FaCar, FaChartPie, FaCalendarAlt, 
  FaMapMarkerAlt, FaCloudDownloadAlt, FaInfoCircle 
} from 'react-icons/fa';

// ==========================================
// 📊 REAL MA'LUMOTLAR MASSIVI (DATASET)
// ==========================================

// 1. Yillar kesimida sanoat tarmoqlari bo'yicha zararli moddalar miqdori (ming tonna)
const INDUSTRY_YEARLY_DATA = [
  { yil: '2007', jami: 30.7, energetika: 26.1, neftGaz: 1.7, metallurgiya: 1.6, paxta: 0.25, kimyo: 0.25, qurilish: 0.4 },
  { yil: '2008', jami: 22.1, energetika: 17.2, neftGaz: 1.8, metallurgiya: 1.6, paxta: 0.25, kimyo: 0.28, qurilish: 0.5 },
  { yil: '2009', jami: 16.1, energetika: 14.8, neftGaz: 1.7, metallurgiya: 1.6, paxta: 0.21, kimyo: 0.30, qurilish: 0.45 },
  { yil: '2010', jami: 21.0, energetika: 19.7, neftGaz: 1.8, metallurgiya: 1.9, paxta: 0.26, kimyo: 0.50, qurilish: 0.55 },
  { yil: '2011', jami: 58.67, energetika: 30.9, neftGaz: 4.9, metallurgiya: 4.8, paxta: 4.6, kimyo: 4.6, qurilish: 4.7 },
  { yil: '2012', jami: 46.89, energetika: 29.67, neftGaz: 4.19, metallurgiya: 3.25, paxta: 2.31, kimyo: 3.12, qurilish: 2.95 },
  { yil: '2013', jami: 35.41, energetika: 31.14, neftGaz: 1.34, metallurgiya: 1.10, paxta: 0.70, kimyo: 0.32, qurilish: 0.30 },
  { yil: '2014', jami: 69.28, energetika: 42.28, neftGaz: 3.85, metallurgiya: 2.56, paxta: 1.77, kimyo: 1.32, qurilish: 1.48 },
  { yil: '2015', jami: 66.12, energetika: 45.11, neftGaz: 5.14, metallurgiya: 3.26, paxta: 1.54, kimyo: 4.87, qurilish: 3.54 },
  { yil: '2016', jami: 68.93, energetika: 49.72, neftGaz: 4.12, metallurgiya: 4.25, paxta: 0.53, kimyo: 5.87, qurilish: 0.81 },
  { yil: '2017', jami: 68.90, energetika: 59.92, neftGaz: 4.18, metallurgiya: 1.25, paxta: 0.53, kimyo: 0.87, qurilish: 0.51 },
  { yil: '2018', jami: 60.50, energetika: 47.57, neftGaz: 1.20, metallurgiya: 1.31, paxta: 6.70, kimyo: 0.65, qurilish: 0.75 },
  { yil: '2019', jami: 64.20, energetika: 56.36, neftGaz: 1.39, metallurgiya: 1.36, paxta: 1.54, kimyo: 0.97, qurilish: 0.65 },
  { yil: '2020', jami: 75.29, energetika: 66.07, neftGaz: 1.63, metallurgiya: 1.59, paxta: 1.81, kimyo: 1.14, qurilish: 0.76 },
];

// 2. Shahar va tumanlar kesimida transport va sanoat ulushi (2022-2023 yillar)
const DISTRICT_EMISSION_DATA = [
  { tuman: 'Guliston sh.', t22_trans: 2.487, t22_san: 1.421, t22_jami: 3.908, t23_trans: 2.520, t23_san: 1.340, t23_jami: 3.860 },
  { tuman: 'Yangiyer sh.', t22_trans: 2.210, t22_san: 0.616, t22_jami: 2.825, t23_trans: 2.180, t23_san: 0.690, t23_jami: 2.870 },
  { tuman: 'Shirin sh.', t22_trans: 2.756, t22_san: 33.314, t22_jami: 36.070, t23_trans: 2.690, t23_san: 29.800, t23_jami: 32.490 },
  { tuman: 'Xovos t.', t22_trans: 1.798, t22_san: 0.513, t22_jami: 2.312, t23_trans: 1.850, t23_san: 0.480, t23_jami: 2.330 },
  { tuman: 'Oqoltin t.', t22_trans: 2.365, t22_san: 0.121, t22_jami: 2.485, t23_trans: 2.460, t23_san: 0.460, t23_jami: 2.920 },
  { tuman: 'Sardoba t.', t22_trans: 2.080, t22_san: 1.500, t22_jami: 3.579, t23_trans: 2.400, t23_san: 1.320, t23_jami: 3.720 },
  { tuman: 'Sayxunobod t.', t22_trans: 1.953, t22_san: 0.868, t22_jami: 2.821, t23_trans: 1.840, t23_san: 0.810, t23_jami: 2.650 },
  { tuman: 'Sirdaryo t.', t22_trans: 3.302, t22_san: 3.079, t22_jami: 6.381, t23_trans: 3.450, t23_san: 3.150, t23_jami: 6.600 },
  { tuman: 'Guliston t.', t22_trans: 1.513, t22_san: 0.575, t22_jami: 2.088, t23_trans: 1.530, t23_san: 0.640, t23_jami: 2.170 },
  { tuman: 'Boyovut t.', t22_trans: 2.776, t22_san: 1.729, t22_jami: 4.506, t23_trans: 2.660, t23_san: 1.650, t23_jami: 4.310 },
  { tuman: 'Mirzaobod t.', t22_trans: 1.933, t22_san: 0.464, t22_jami: 2.396, t23_trans: 1.850, t23_san: 0.410, t23_jami: 2.260 },
];

// 3. Sanoat tarmoqlarining so'nggi ma'lum yil (2020) bo'yicha ulushi (Pie uchun)
const INDUSTRY_PIE_2020 = [
  { name: 'Energetika', value: 66.078, color: '#3b82f6' },
  { name: 'Paxta sanoati', value: 1.818, color: '#10b981' },
  { name: 'Neft va gaz', value: 1.639, color: '#f59e0b' },
  { name: 'Metallurgiya', value: 1.599, color: '#ec4899' },
  { name: 'Kimyo korxonalari', value: 1.140, color: '#8b5cf6' },
  { name: 'Qurilish korxonalari', value: 0.768, color: '#ef4444' },
];

export default function AtmospherePage() {
  const [districtYear, setDistrictYear] = useState('2023');

  // Custom Glassmorphism Tooltip renderi
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl">
          <p className="text-slate-400 font-semibold mb-2">{label}</p>
          {payload.map((item, index) => (
            <div key={index} className="flex items-center gap-3 text-sm my-1">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-slate-200 font-medium">{item.name}:</span>
              <span className="text-white font-bold ml-auto">{item.value.toFixed(2)} ming tn</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-500 via-green-600 to-indigo-950 text-slate-100 p-6 font-sans antialiased selection:bg-indigo-500/30">
      
      {/* 🚀 GLOWING HEADER BACKGROUND */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* 🔝 TOP NAVIGATION HEADER */}
      <header className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl mb-8 shadow-lg">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl shadow-indigo-500/20">
            <FaWind className="text-2xl text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Atmosfera va Havo Sifati Tahlili
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-0.5">Sirdaryo viloyati ekologik monitoring tahliliy paneli</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 rounded-xl font-semibold text-sm transition-all duration-300 shadow-md hover:scale-[1.02] active:scale-[0.98]">
            <FaCloudDownloadAlt className="text-base" /> Export PDF
          </button>
        </div>
      </header>

      {/* 📈 MAIN CARDS: LIVE STATS SUMMARY */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Card 1 */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/20 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-blue-500/40 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaIndustry className="text-8xl text-blue-500" />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Eng Yuqori Sanoat Tashlamasi</p>
          <h3 className="text-3xl font-black text-white tracking-tight">32.49 <span className="text-sm font-medium text-slate-400">ming tn</span></h3>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-2.5 py-0.5 rounded-lg bg-red-500/10 text-red-400 font-bold border border-red-500/20">Kritik</span>
            <span className="text-slate-400 font-semibold"><FaMapMarkerAlt className="inline mr-1" />Shirin shahri (2023)</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/20 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-emerald-500/40 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaCar className="text-8xl text-emerald-500" />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Jami Transport Tashlamasi</p>
          <h3 className="text-3xl font-black text-white tracking-tight">25.43 <span className="text-sm font-medium text-slate-400">ming tn</span></h3>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">+1.02%</span>
            <span className="text-slate-400 font-semibold"><FaCalendarAlt className="inline mr-1" />2022 yilga nisbatan o'sish</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-gradient-to-b from-slate-900/60 to-slate-900/20 backdrop-blur-xl border border-slate-800/80 p-6 rounded-3xl shadow-xl relative overflow-hidden group hover:border-purple-500/40 transition-all duration-500">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <FaWind className="text-8xl text-purple-500" />
          </div>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Viloyat Bo'yicha Jami Emissiya</p>
          <h3 className="text-3xl font-black text-white tracking-tight">66.18 <span className="text-sm font-medium text-slate-400">ming tn</span></h3>
          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="px-2.5 py-0.5 rounded-lg bg-blue-500/10 text-blue-400 font-bold border border-blue-500/20">-4.60%</span>
            <span className="text-slate-400 font-semibold">2022 yilga nisbatan kamayish</span>
          </div>
        </div>
      </section>

      {/* 🗺 SECTION 1: TIMELINE AREA CHART (SANOAT TARMOQLARI DINAMIKASI) */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Sanoat tarmoqlari xronologiyasi - Area Chart */}
        <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 rounded-3xl shadow-xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FaIndustry className="text-blue-400" /> Sanoat Korxonalari Tashlamalari Dinamikasi
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">2007 - 2020 yillardagi tarmoqlar kesimidagi o'zgarishlar</p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-800/60 p-1.5 rounded-xl border border-slate-700/40">
              <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 font-bold">Yillik Trend</span>
            </div>
          </div>
          
          <div className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={INDUSTRY_YEARLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorEnergetika" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorJami" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis dataKey="yil" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '15px' }} />
                <Area type="monotone" name="Umumiy Jami" dataKey="jami" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorJami)" />
                <Area type="monotone" name="Energetika (Issiqlik quvvati)" dataKey="energetika" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorEnergetika)" />
                <Line type="monotone" name="Neft va Gaz" dataKey="neftGaz" stroke="#f59e0b" strokeWidth={2} dot={false} />
                <Line type="monotone" name="Metallurgiya" dataKey="metallurgiya" stroke="#ec4899" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* So'nggi Ulush - Pie Chart */}
        <div className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 rounded-3xl shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaChartPie className="text-purple-400" /> Sanoat Tarmoqlari Ulushi
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Tarmoqlarning atmosferaga ta'siri (Foiz ko'rinishida)</p>
          </div>

          <div className="w-full h-52 relative flex items-center justify-center my-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={INDUSTRY_PIE_2020}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {INDUSTRY_PIE_2020.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(2)} ming tn`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute text-center">
              <p className="text-xs uppercase text-slate-400 font-bold tracking-widest">Dominant</p>
              <p className="text-sm font-black text-white">Energetika</p>
              <p className="text-[11px] text-blue-400 font-semibold">87.7%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {INDUSTRY_PIE_2020.map((item, index) => (
              <div key={index} className="flex items-center gap-2 bg-slate-800/30 p-2 border border-slate-800 rounded-xl">
                <span className="w-2.5 h-2.5 rounded-md flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate font-medium">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 📊 SECTION 2: DISTRICT COMPARISON (SHAHAR VA TUMANLAR TAQQOSLOVI) */}
      <section className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/60 p-6 rounded-3xl shadow-xl mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FaMapMarkerAlt className="text-emerald-400" /> Shahar va Tumanlar Miqyosida Emissiya Tahlili
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Transport va Sanoat manbalaridan chiqayotgan chiqindilar miqdori</p>
          </div>
          
          {/* Yilni filtrlash tugmalari */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 shadow-inner">
            <button 
              onClick={() => setDistrictYear('2022')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${districtYear === '2022' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              2022 yil
            </button>
            <button 
              onClick={() => setDistrictYear('2023')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 ${districtYear === '2023' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'}`}
            >
              2023 yil
            </button>
          </div>
        </div>

        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={DISTRICT_EMISSION_DATA} 
              margin={{ top: 20, right: 10, left: -20, bottom: 10 }}
              barGap={4}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} vertical={false} />
              <XAxis dataKey="tuman" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar 
                name="Avtotransport" 
                dataKey={districtYear === '2022' ? 't22_trans' : 't23_trans'} 
                fill="#38bdf8" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={28}
              />
              <Bar 
                name="Sanoat korxonalari" 
                dataKey={districtYear === '2022' ? 't22_san' : 't23_san'} 
                fill="#818cf8" 
                radius={[6, 6, 0, 0]} 
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* 💡 FOOTER DISCLOSURE: MA'LUMOT MANBASI */}
      <footer className="bg-slate-900/20 backdrop-blur-md border border-slate-800/80 p-4 rounded-2xl flex items-start sm:items-center gap-3 text-xs text-slate-400">
        <FaInfoCircle className="text-base text-indigo-400 flex-shrink-0 mt-0.5 sm:mt-0" />
        <p>
          <strong>Ma'lumotlar manbasi:</strong> Sirdaryo viloyati ekologiya va atrof-muhitni muhofaza qilish boshqarmasi tomonidan taqdim etilgan rasmiy statistika. Ko'rsatkichlar <span className="text-slate-200 font-semibold">ming tonna</span> o'lchov birligida hisoblangan. Ekologik prognozlarni tuzish uchun unga muvofiq foydalaniladi.
        </p>
      </footer>
    </div>
  );
}