import { useState, useMemo } from 'react';
import { ATMOSPHERE_DATA } from '../data/atmosphereData'; // Ma'lumotlar faylingiz
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import * as XLSX from 'xlsx';
import { 
  HiDocumentArrowDown, 
  HiMagnifyingGlass, 
  HiPresentationChartBar, 
  HiCloud, 
  HiTruck, 
  HiBuildingOffice2 
} from 'react-icons/hi2';

export default function AtmosphereDashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedYear, setSelectedYear] = useState('2023'); // 2022 yoki 2023 yil filtri

  // 1. DATA FORMATLASH (Chart va Table uchun moslashuvchan massivga o'giramiz)
  const formattedData = useMemo(() => {
    return Object.keys(ATMOSPHERE_DATA).map((key) => ({
      name: key,
      ...ATMOSPHERE_DATA[key],
    }));
  }, []);

  // 2. VILOYAT BO'YICHA UMUMIY STATISTIKANI HISOBLASH (KPIs)
  const stats = useMemo(() => {
    let jamiTransport = 0;
    let jamiSanoat = 0;
    let jamiChiqindi = 0;

    formattedData.forEach(item => {
      jamiTransport += item[`transport${selectedYear}`] || 0;
      jamiSanoat += item[`sanoat${selectedYear}`] || 0;
      jamiChiqindi += item[`jami${selectedYear}`] || 0;
    });

    return {
      transport: jamiTransport.toFixed(2),
      sanoat: jamiSanoat.toFixed(2),
      jami: jamiChiqindi.toFixed(2)
    };
  }, [formattedData, selectedYear]);

  // 3. QIDIRUV FILTRI
  const filteredData = useMemo(() => {
    return formattedData.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [formattedData, searchTerm]);

  // 4. CHART UCHUN DATA TAYYORLASH (Tanlangan yilga qarab dinamik ustunlar)
  const chartData = useMemo(() => {
    return filteredData.map(item => ({
      name: item.name.replace(" Tumani", "").replace(" shahri", ""),
      "Transport": item[`transport${selectedYear}`],
      "Sanoat": item[`sanoat${selectedYear}`],
      "Jami Chiqindi": item[`jami${selectedYear}`]
    }));
  }, [filteredData, selectedYear]);

  // 5. EXCEL FAYL YUKLAB OLISH FUNKSIYASI (Eksport)
  const exportToExcel = () => {
    const rows = formattedData.map((item, index) => ({
      "№": index + 1,
      "Tuman / Shahar nomi": item.name,
      "2022 Transport (ming t)": item.transport2022,
      "2022 Sanoat (ming t)": item.sanoat2022,
      "2022 Jami (ming t)": item.jami2022,
      "2023 Transport (ming t)": item.transport2023,
      "2023 Sanoat (ming t)": item.sanoat2023,
      "2023 Jami (ming t)": item.jami2023,
    }));

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Atmosfera_Hisoboti");

    // Ustun kengliklarini avtomat moslash
    worksheet["!cols"] = [{ wch: 5 }, { wch: 25 }, { wch: 22 }, { wch: 20 }, { wch: 20 }, { wch: 22 }, { wch: 20 }, { wch: 20 }];

    // Faylni saqlash va yuklash
    XLSX.writeFile(workbook, `Sirdaryo_Atmosfera_Ifloslanish_Hisoboti.xlsx`);
  };

  return (
    <div className="min-h-screen  p-4 sm:p-6 lg:p-8 font-sans">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-slate-200 pb-5 mb-6 gap-4">
        <div>
          <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-wider text-xs mb-1">
            <HiPresentationChartBar className="w-4 h-4" /> Ekologik Monitoring Tizimi
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Atmosferaga Chiqarilayotgan Tashlamalar Tahlili
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Sirdaryo viloyati hududlari bo'yicha transport va sanoat korxonalari chiqindilari statistikasi.
          </p>
        </div>

        {/* Filtr va Eksport Tugmasi */}
        <div className="flex items-center gap-3 self-start md:self-center">
          <div className="flex bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            <button 
              onClick={() => setSelectedYear('2022')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedYear === '2022' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2022-yil
            </button>
            <button 
              onClick={() => setSelectedYear('2023')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${selectedYear === '2023' ? 'bg-slate-950 text-white shadow-md' : 'text-slate-600 hover:text-slate-900'}`}
            >
              2023-yil
            </button>
          </div>

          <button 
            onClick={exportToExcel}
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-600/10 hover:shadow-emerald-600/20 transition-all border border-emerald-500/20 active:scale-95 cursor-pointer"
          >
            <HiDocumentArrowDown className="w-4 h-4" />
            <span>Excel yuklab olish</span>
          </button>
        </div>
      </div>

      {/* --- 2. KPI STATISTIKA KARTALARI --- */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-xl border border-blue-100">
            <HiTruck className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">Jami Avtotransportlar</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.transport} <span className="text-xs font-semibold text-slate-400">ming t</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3.5 bg-rose-50 text-rose-600 rounded-xl border border-rose-100">
            <HiBuildingOffice2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">Jami Turg'un Manbalar (Sanoat)</p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{stats.sanoat} <span className="text-xs font-semibold text-slate-400">ming t</span></h3>
          </div>
        </div>

        <div className="bg-white border border-slate-200/60 p-5 rounded-2xl shadow-sm flex items-center gap-4 sm:col-span-2 lg:col-span-1">
          <div className="p-3.5 bg-slate-900 text-white rounded-xl">
            <HiCloud className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider m-0">Viloyat Bo'yicha Umumiy Chiqindi ({selectedYear})</p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{stats.jami} <span className="text-xs font-semibold text-slate-400">ming t</span></h3>
          </div>
        </div>
      </div>

      {/* --- 3. DIAGRAMMA BLOCKI --- */}
      <div className="bg-white border border-slate-200/70 rounded-3xl p-4 sm:p-6 shadow-sm mb-6">
        <div className="mb-4">
          <h3 className="text-base font-black text-slate-900">Hududlar kesimida taqqoslash diagrammasi</h3>
          <p className="text-xs text-slate-400 font-medium">Ustunlar ustiga bosib yoki sichqonchani olib borib batafsil ko'rish mumkin.</p>
        </div>
        
        <div className="w-full h-80 sm:h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.6} />
              <XAxis dataKey="name" fontSize={11} tickLine={false} stroke="#64748b" fontWeight={700} />
              <YAxis fontSize={11} tickLine={false} stroke="#64748b" fontWeight={700} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: 'none', color: '#fff', fontSize: '12px', padding: '12px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12, paddingTop: 10 }} />
              <Bar dataKey="Transport" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={18} />
              <Bar dataKey="Sanoat" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={18} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* --- 4. QIDIRUV VA MA'LUMOTLAR JADVALI --- */}
      <div className="bg-white border border-slate-200/70 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Jadval Tepasidagi Qidiruv Satri */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="text-base font-black text-slate-900 m-0">Hududlar tahliliy jadvali</h3>
            <p className="text-xs text-slate-400 m-0 mt-0.5">Barcha raqamlar ming tonna o'lchov birligida ko'rsatilgan.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <HiMagnifyingGlass className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text"
              placeholder="Hududni qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white border border-slate-200 focus:border-slate-400 pl-10 pr-4 py-2 rounded-xl text-xs font-semibold text-slate-700 placeholder-slate-400 focus:outline-none shadow-inner transition-colors"
            />
          </div>
        </div>

        {/* Toza Responsive Jadval */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs">
            <thead className="bg-slate-100/70 text-slate-500 uppercase font-bold text-[10px] tracking-wider border-b border-slate-200/60">
              <tr>
                <th className="py-3 px-5 w-12 text-center">№</th>
                <th className="py-3 px-4">Tuman / Shahar</th>
                <th className="py-3 px-4 text-center bg-blue-50/40 text-blue-700">Transport (2022)</th>
                <th className="py-3 px-4 text-center bg-rose-50/40 text-rose-700">Sanoat (2022)</th>
                <th className="py-3 px-4 text-center font-bold bg-slate-100/50 text-slate-800 border-r border-slate-200">Jami (2022)</th>
                <th className="py-3 px-4 text-center bg-blue-50 text-blue-800">Transport (2023)</th>
                <th className="py-3 px-4 text-center bg-rose-50 text-rose-800">Sanoat (2023)</th>
                <th className="py-3 px-4 text-center font-black bg-slate-900 text-white">Jami (2023)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.name} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5 text-center text-slate-400 font-normal">{index + 1}</td>
                    <td className="py-3.5 px-4 text-slate-900 font-extrabold">{item.name}</td>
                    
                    {/* 2022 Ustunlari */}
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 bg-blue-50/10">{item.transport2022.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-600 bg-rose-50/10">{item.sanoat2022.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-800 font-bold bg-slate-50 border-r border-slate-200">{item.jami2022.toFixed(3)}</td>
                    
                    {/* 2023 Ustunlari */}
                    <td className="py-3.5 px-4 text-center font-mono text-blue-600 bg-blue-50/30">{item.transport2023.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-rose-600 bg-rose-50/30">{item.sanoat2023.toFixed(3)}</td>
                    <td className="py-3.5 px-4 text-center font-mono text-slate-900 font-black bg-slate-100/60">{item.jami2023.toFixed(3)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-slate-400 font-medium">
                    Qidiruvga mos keladigan hudud topilmadi.
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