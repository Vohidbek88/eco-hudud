import { useState, useMemo } from 'react';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import * as XLSX from 'xlsx';
import YASHIL_MAKON_DATA from '../data/yashil_makon_nested_finalv1.json'; // Ma'lumotlar faylingiz
import { 
  HiDocumentArrowDown, HiMagnifyingGlass, HiChartPie,
  HiSun, HiCloud, HiCheckCircle, HiArrowTrendingUp 
} from 'react-icons/hi2';

// 1. SIZ TAQDIM ETGAN MA'LUMOTLAR STRUKTURASI (Massiv formatida kengaytirilgan shakli)

export default function YashilMakonDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSeason, setActiveSeason] = useState('Bahorda'); // 'Bahorda' yoki 'Kuzda'
  const [activeYear, setActiveYear] = useState('2025'); // Defolt tahlil yili

  // 2. QIDIRUV VA FILTRLASH
  const filteredData = useMemo(() => {
    return YASHIL_MAKON_DATA.filter(item =>
      item.tumanShaharNomi.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  // 3. SELECTION BO'YICHA CHART DATA GENERATSIYA QILISH (Yillar kesimida dinamik grafik)
  const yearlyTrendData = useMemo(() => {
    // Tanlangan birinchi tuman misolida yillar dinamikasini yig'ish
    const targetDistrict = filteredData[0];
    if (!targetDistrict) return [];

    const seasonData = targetDistrict[activeSeason] || {};
    return Object.keys(seasonData).map(year => ({
      year: year + "-yil",
      "Topshiriq": seasonData[year].topshiriqberildi,
      "Bajarildi": seasonData[year].amalgaoshirildi,
      "Foiz": seasonData[year].foizda
    }));
  }, [filteredData, activeSeason]);

  // 4. JORIY TANLANGAN YIL VA MAVSUM KPI KARTALARI HISOBLASH
  const currentKPI = useMemo(() => {
    let totalPlan = 0;
    let totalDone = 0;
    
    filteredData.forEach(dist => {
      const target = dist[activeSeason]?.[activeYear];
      if (target) {
        totalPlan += target.topshiriqberildi;
        totalDone += target.amalgaoshirildi;
      }
    });

    const averagePercent = totalPlan > 0 ? ((totalDone / totalPlan) * 100).toFixed(2) : 0;

    return {
      plan: totalPlan.toFixed(2),
      done: totalDone.toFixed(2),
      percent: averagePercent
    };
  }, [filteredData, activeSeason, activeYear]);

  // 5. CHIROYLI EXCEL EXPORT FUNKSIYASI
  const handleExportExcel = () => {
    const rows = [];
    YASHIL_MAKON_DATA.forEach((dist) => {
      // Bahor ma'lumotlari
      Object.keys(dist.Bahorda).forEach(year => {
        rows.push({
          "Hudud Nomi": dist.tumanShaharNomi,
          "Mavsum": "Bahor",
          "Yil": year,
          "Belgilangan Topshiriq (tup)": dist.Bahorda[year].topshiriqberildi,
          "Amalga oshirildi (tup)": dist.Bahorda[year].amalgaoshirildi,
          "Bajarilish foizi (%)": dist.Bahorda[year].foizda,
        });
      });
      // Kuz ma'lumotlari
      Object.keys(dist.Kuzda).forEach(year => {
        rows.push({
          "Hudud Nomi": dist.tumanShaharNomi,
          "Mavsum": "Kuz",
          "Yil": year,
          "Belgilangan Topshiriq (tup)": dist.Kuzda[year].topshiriqberildi,
          "Amalga oshirildi (tup)": dist.Kuzda[year].amalgaoshirildi,
          "Bajarilish foizi (%)": dist.Kuzda[year].foizda,
        });
      });
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Yashil_Makon_Tahlil");

    // Ustun o'lchamlarini optimallash
    worksheet["!cols"] = [{ wch: 22 }, { wch: 12 }, { wch: 10 }, { wch: 26 }, { wch: 24 }, { wch: 20 }];

    XLSX.writeFile(workbook, `Yashil_Makon_Umumiy_Eksport_Hisoboti.xlsx`);
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 font-sans antialiased text-slate-800">
      
      {/* 1. TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-6 mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs mb-1.5">
            <HiChartPie className="w-4 h-4 text-emerald-500" /> Davlat ekologik dasturlari tahlili
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            “Yashil Makon” Umummilliy Loyihasi Dashboardi
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            Mavsumiy koʻchat ekish topshiriqlari va ularning yillar kesimidagi haqiqiy dinamikasi.
          </p>
        </div>

        {/* Excel Yuklash Tugmasi */}
        <button 
          onClick={handleExportExcel}
          className="inline-flex items-center justify-center gap-2.5 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 active:scale-[0.98] transition-all border border-emerald-500/10 cursor-pointer self-start md:self-center"
        >
          <HiDocumentArrowDown className="w-4 h-4 text-emerald-100" />
          <span>Barcha ma'lumotlarni Excelga yuklash</span>
        </button>
      </div>

      {/* 2. FILTRLAR PANEL */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        
        {/* Mavsumiy Toggle Switch */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Mavsum:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button 
              onClick={() => { setActiveSeason('Bahorda'); if(activeYear === '2026') setActiveYear('2025'); }}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all w-full sm:w-auto ${activeSeason === 'Bahorda' ? 'bg-white text-emerald-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <HiSun className="w-4 h-4" /> Bahor ko'chatlari
            </button>
            <button 
              onClick={() => { setActiveSeason('Kuzda'); if(activeYear === '2026') setActiveYear('2025'); }}
              className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-extrabold transition-all w-full sm:w-auto ${activeSeason === 'Kuzda' ? 'bg-white text-orange-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              <HiCloud className="w-4 h-4" /> Kuz ko'chatlari
            </button>
          </div>
        </div>

        {/* Yillar Filtri */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-2">Yil tahlili:</span>
          <div className="flex bg-slate-100 p-1 rounded-xl overflow-x-auto">
            {['2023', '2024', '2025', ...(activeSeason === 'Bahorda' ? ['2026'] : [])].map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeYear === year ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                {year}-y
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. DINAMIK KPI STATISTIKA KARTALARI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl border border-blue-100/60">
            <HiDocumentArrowDown className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Reja / Topshiriq berildi</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{currentKPI.plan} <span className="text-xs font-medium text-slate-400">ming tup</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100/60">
            <HiCheckCircle className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">Haqiqatda ekilgan ko'chatlar</p>
            <h3 className="text-xl font-black text-slate-800 mt-1">{currentKPI.done} <span className="text-xs font-medium text-slate-400">ming tup</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/70 p-5 rounded-2xl shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className={`p-3 rounded-xl border ${parseFloat(currentKPI.percent) >= 100 ? 'bg-emerald-500 text-white border-emerald-600' : 'bg-amber-500 text-white border-amber-600'}`}>
            <HiArrowTrendingUp className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider m-0">O'rtacha bajarilish koeffitsiyenti</p>
            <h3 className="text-xl font-black text-slate-900 mt-1">{currentKPI.percent}%</h3>
          </div>
        </div>
      </div>

      {/* 4. GRAFIKLAR DIAGRAMMA OYNASI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        
        {/* Asosiy Bar va Line Analitika Chart */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Yillar kesimida solishtirish oʻsish dinamikasi</h3>
            <p className="text-xs text-slate-400 font-medium">Tanlangan mavsum bo'yicha topshiriq va amaliyot nisbati.</p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={11} stroke="#64748b" fontWeight={600} tickLine={false} />
                <YAxis fontSize={11} stroke="#64748b" fontWeight={600} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '14px', border: 'none', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Bar dataKey="Topshiriq" fill="#94a3b8" radius={[4, 4, 0, 0]} barSize={24} name="Reja (ming tup)" />
                <Bar dataKey="Bajarildi" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} name="Ekilgan (ming tup)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chiziqli (Line) Foizli Trend Diagrammasi */}
        <div className="bg-white border border-slate-200/70 rounded-3xl p-5 shadow-sm">
          <div className="mb-4">
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Foiz samaradorligi trendi</h3>
            <p className="text-xs text-slate-400 font-medium">Rejaning bajarilish foizi chizig'i.</p>
          </div>
          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={yearlyTrendData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="year" fontSize={11} stroke="#64748b" fontWeight={600} tickLine={false} />
                <YAxis fontSize={11} stroke="#64748b" fontWeight={600} tickLine={false} domain={[90, 110]} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '11px' }} />
                <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
                <Line type="monotone" dataKey="Foiz" stroke="#4f46e5" strokeWidth={3} dot={{ r: 5 }} name="Bajarilish foizi (%)" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 5. JADVAL QISMI */}
      <div className="bg-white border border-slate-200/70 rounded-3xl shadow-sm overflow-hidden">
        
        {/* Jadval header va qidiruv */}
        <div className="p-4 sm:p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight m-0">Hududlar tahliliy reyting jadvali</h3>
            <p className="text-xs text-slate-400 font-medium m-0 mt-0.5">Mavsum: {activeSeason}, Tahlil yili: {activeYear}-yil</p>
          </div>

          <div className="relative w-full sm:w-64">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Hududni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-slate-400 pl-9 pr-4 py-1.5 rounded-xl text-xs font-semibold focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* Jadval */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead className="bg-slate-100/60 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/50">
              <tr>
                <th className="py-3 px-5 text-center w-12">№</th>
                <th className="py-3 px-4">Tuman / Shahar nomi</th>
                <th className="py-3 px-4 text-center">Belgilangan reja (ming tup)</th>
                <th className="py-3 px-4 text-center">Amalga oshirildi (ming tup)</th>
                <th className="py-3 px-4 text-center">Bajarilish foizi</th>
                <th className="py-3 px-4 text-center">Holati</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => {
                  const targetData = item[activeSeason]?.[activeYear];
                  if (!targetData) return null;

                  return (
                    <tr key={item.tumanShaharNomi} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-5 text-center text-slate-400 font-normal">{index + 1}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">{item.tumanShaharNomi}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600">{targetData.topshiriqberildi.toFixed(3)}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-600">{targetData.amalgaoshirildi.toFixed(3)}</td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-900 font-extrabold">{targetData.foizda.toFixed(2)}%</td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-black ${targetData.foizda >= 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                          {targetData.foizda >= 100 ? "Reja bajarildi" : "Deyarli bajarildi"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                    Ma'lumotlar topilmadi yoki qidiruv mos kelmadi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}