import { useState, useMemo } from 'react'

import { 
  HiGlobeAlt, 
  HiAcademicCap, 
  HiBookOpen, 
  HiDocumentText, 
  HiGlobeAsiaAustralia, 
  HiArrowDownTray,
  HiBriefcase,
  HiLink
} from 'react-icons/hi2'
import { LITERATURE_DATA } from '../data/literatura_data';

// Tizim uchun test ma'lumotlari kislotasi

const REGIONS = {
  uzbekistan: { label: "O'zbekiston", icon: HiGlobeAsiaAustralia },
  cis: { label: "MDH Davlatlari", icon: HiBriefcase },
  world: { label: "Jahon miqyosida", icon: HiGlobeAlt }
};

const TYPES = {
  all: "Barcha adabiyotlar",
  article: "Ilmiy maqola",
  book: "Darslik / Qo'llanma",
  monograph: "Monografiya",
  dissertation: "Dissertatsiya",
  abstract: "Aftoreferat",
  internet_resource: "Internet manba"
};

// Har bir turga mos keladigan maxsus ikonalar xaritasi
const TYPE_ICONS = {
  article: HiDocumentText,
  book: HiBookOpen,
  monograph: HiAcademicCap,
  dissertation: HiAcademicCap,
  abstract: HiDocumentText,
  internet_resource: HiLink
};

export default function LiteraturePage() {
  const [selectedRegion, setSelectedRegion] = useState("uzbekistan");
  const [selectedType, setSelectedType] = useState("all");

  // Faqat filtrlar orqali hisoblash mantig'i (Qidiruvsiz)
  const filteredLiterature = useMemo(() => {
    return LITERATURE_DATA.filter(item => {
      const matchesRegion = selectedRegion === "all" || item.region === selectedRegion;
      const matchesType = selectedType === "all" || item.type === selectedType;
      return matchesRegion && matchesType;
    });
  }, [selectedRegion, selectedType]);

  return (
    <div className="min-h-screen py-12 px-6 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* --- ULTRA PREMIUM HEADER --- */}
        <div className="relative border-b border-slate-200 pb-8 space-y-3">
          <div className="absolute -top-4 -left-4 w-24 h-24 bg-blue-400/10 blur-3xl rounded-full pointer-events-none" />
          <div className="flex items-center gap-3 text-center">
            <span className="p-2 bg-blue-600/5 text-blue-600 rounded-xl border border-blue-500/10 shadow-sm">
              <HiBookOpen className="w-6 h-6" />
            </span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Adabiyotlar & Akademik Manbalar
            </h2>
          </div>
          <p className="text-base text-white/50 max-w-3xl leading-relaxed">
            Sirdaryo mintaqasi ekologik holati, gidrologik hisoblar va global suv havzalari monitoringiga oid eng nufuzli professor-oʻqituvchilarning ilmiy ishlari, dissertatsiyalari hamda raqamli resurslar kutubxonasi.
          </p>
        </div>

        {/* --- PREMIUM FILTERING CONTROL PANEL --- */}
        <div className="bg-gray backdrop-blur-md  p-5 rounded-2xl shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6 transition-all">
          
          {/* Chap taraf: Hududiy tablar */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {Object.entries(REGIONS).map(([key, value]) => {
              const Icon = value.icon;
              const isSelected = selectedRegion === key;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedRegion(key)}
                  className={`flex items-center gap-2 px-5 py-2.5 text-xs font-bold tracking-wide uppercase rounded-xl border transition-all duration-300 ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-md shadow-slate-900/10 scale-[1.02]'
                      : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-50 hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                  {value.label}
                </button>
              );
            })}
          </div>

          {/* O'ng taraf: Ma'lumot turi bo'yicha modern dropdown */}
          <div className="relative w-full md:w-72">
  
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full bg-white/80 border border-slate-200 text-slate-700 rounded-xl px-4 py-3 text-sm font-semibold shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 outline-none cursor-pointer appearance-none transition-all"
            >
              {Object.entries(TYPES).map(([key, value]) => (
                <option key={key} value={key} className="font-sans py-2 text-slate-800">{value}</option>
              ))}
            </select>
            {/* Custom dropdown o'qi */}
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* --- SCIENTIFIC CARDS GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLiterature.length > 0 ? (
            filteredLiterature.map((lit) => {
              const TypeIcon = TYPE_ICONS[lit.type] || HiDocumentText;
              const RegionIcon = REGIONS[lit.region]?.icon || HiGlobeAlt;

              return (
                <div 
                  key={lit.id} 
                  className="group bg-slate-50/70 hover:bg-white border border-slate-200/70 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between gap-5 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Dekorativ yuqori chiziq gradisenti */}
                  <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-slate-300/40 to-transparent group-hover:via-blue-500/50 transition-all duration-500" />
                  
                  <div className="space-y-4">
                    {/* Badge qatorlar */}
                    <div className="flex justify-between items-center">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-200/80 text-[11px] font-bold text-slate-600 rounded-lg uppercase tracking-wide shadow-2xs">
                        <TypeIcon className="w-3.5 h-3.5 text-blue-500" />
                        {TYPES[lit.type]}
                      </span>
                      <span className="text-xs font-bold  bg-white px-2 py-0.5 rounded-md">
                        {lit.year}
                      </span>
                    </div>

                    {/* Sarlavha */}
                    <h3 className="text-[15px] font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors line-clamp-3">
                      {lit.title}
                    </h3>

                    {/* Avtor & Institut */}
                    <div className="space-y-1.5 border-t border-slate-200/50 pt-3">
                      <p className="font-semibold  flex items-center gap-1.5">
                        <span className="text-sm">Muallif:</span> {lit.author}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1.5 leading-tight">
                        <span className="inline-block w-1.5 h-1.5 bg-slate-300 rounded-full flex-shrink-0" />
                        {lit.institution}
                      </p>
                    </div>
                  </div>

                  {/* Karta Osti paneli */}
                  <div className="flex items-center justify-between border-t border-slate-200/50 pt-3 mt-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-bold ">
                      <RegionIcon className="w-4 h-4 text-black" />
                      {REGIONS[lit.region]?.label.split(" ")[0]} {/* Faqat asosiy so'zni oladi */}
                    </span>
                    
                    <a 
                      href={lit.downloadUrl} 
                      target='_blank'
                      className="inline-flex items-center gap-1.5 bg-white hover:bg-blue-600 border border-slate-200 hover:border-blue-600 text-xs font-bold text-slate-700 hover:text-white px-3.5 py-2 rounded-xl transition-all duration-200 shadow-2xs group-hover:border-slate-300/80"
                    >
                      <HiArrowDownTray className="w-3.5 h-3.5" />
                      Manba
                    </a>
                  </div>

                </div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white/40">
              <HiDocumentText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-400">
                Tanlangan filtrlash bo'yicha hech qanday ilmiy adabiyot topilmadi.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}