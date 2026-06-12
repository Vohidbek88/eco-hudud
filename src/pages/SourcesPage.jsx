import { useState } from 'react'
import * as XLSX from 'xlsx'
import { 
  HiDocumentChartBar, 
  HiArrowDownTray, 
  HiEye, 
  HiArrowLeft, 
  HiTableCells,
  HiCircleStack
} from 'react-icons/hi2'

// Tizim uchun Excel manbalar ro'yxati (Ular public/data/ papkasida turadi deb hisoblaymiz)
const EXCEL_SOURCES = [
  { id: 1, name: "Sirdaryo daryosi yillik suv sarfi ko'rsatkichlari", fileUrl: "/data/sirdaryo_suv_sarfi.xlsx", size: "142 KB", date: "2026-05-10", sheetsCount: 2 },
  { id: 2, name: "Viloyat kollektor-zovur tarmoqlari mineralizatsiya darajasi", fileUrl: "/data/mineralizatsiya_monitoring.xlsx", size: "95 KB", date: "2026-06-01", sheetsCount: 1 },
  { id: 3, name: "Gidrologik postlar va ulardagi suv sathi o'lchovlari", fileUrl: "/data/gidrologik_postlar.xls", size: "210 KB", date: "2026-04-18", sheetsCount: 3 },
];

export default function SourcesPage() {
  const [previewFile, setPreviewFile] = useState(null) // Ko'rilayotgan fayl haqida ma'lumot
  const [tableData, setTableData] = useState([])       // Exceldan olingan qatorlar (Rows)
  const [tableHeaders, setTableHeaders] = useState([]) // Exceldan olingan ustunlar (Headers)
  const [loading, setLoading] = useState(false)

  // EXCEL FAYLNI ONLINE KO'RISH (VIEWER MANTIQLARI)
  const handlePreview = async (fileInfo) => {
    setLoading(true)
    setPreviewFile(fileInfo)
    
    try {
      // 1. Excel faylni yuklab olish
      const response = await fetch(fileInfo.fileUrl)
      const arrayBuffer = await response.arrayBuffer()
      
      // 2. SheetJS (XLSX) orqali o'qish
      const workbook = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })
      
      // 3. Birinchi varaqni (First Sheet) tanlash
      const firstSheetName = workbook.SheetNames[0]
      const worksheet = workbook.Sheets[firstSheetName]
      
      // 4. JSON formatga o'tkazish (Header: 1 -> Array shaklida massiv beradi)
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
      
      if (jsonData.length > 0) {
        setTableHeaders(jsonData[0]) // Birinchi qator - ustun nomlari
        setTableData(jsonData.slice(1)) // Qolgan qatorlar - ma'lumotlar
      }
    } catch (error) {
      console.error("Excel faylni o'qishda xatolik:", error)
      alert("Faylni yuklash yoki o'qishda xatolik yuz berdi. (Fayl public papkasida mavjudligini tekshiring)")
    } finally {
      setLoading(false)
    }
  }

  // PREVIEW REJIMIDAN CHIQISH
  const handleBack = () => {
    setPreviewFile(null)
    setTableData([])
    setTableHeaders([])
  }

  return (
    <div className="min-h-screen  py-12 px-6 sm:px-8 lg:px-16 font-sans">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* --- VIEW 1: EXCEL REJIMIDA ILG'OR TABLITSA JADVALI (VIEWER) --- */}
        {previewFile ? (
          <div className="space-y-6 animate-fadeIn">
            {/* Orqaga qaytish paneli */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleBack}
                  className="p-2.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl transition-all flex items-center justify-center shadow-2xs cursor-pointer"
                >
                  <HiArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h3 className="text-xl font-extrabold text-slate-800 tracking-tight line-clamp-1">
                    {previewFile.name}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                    <HiTableCells className="text-blue-500 w-3.5 h-3.5" /> Birinchi sahifa (Sheet 1) ko'rinishi
                  </p>
                </div>
              </div>

              {/* Viewer ichidan turib ham yuklab olish imkoniyati */}
              <a 
                href={previewFile.fileUrl}
                download
                className="inline-flex items-center justify-center gap-2 bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md shadow-slate-950/10 transition-all cursor-pointer"
              >
                <HiArrowDownTray className="w-4 h-4" /> Excelni Yuklab Olish
              </a>
            </div>

            {/* Excel Ma'lumotlari Yuklanayotgan holat */}
            {loading ? (
              <div className="py-32 text-center bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl">
                <div className="w-10 h-10 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-semibold text-slate-500">Excel jadvali render qilinmoqda...</p>
              </div>
            ) : (
              /* ULTRA MODERN JADVAL CONTAINER'I */
              <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/40 overflow-hidden">
                <div className="overflow-x-auto max-h-[650px]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-900/95 text-white sticky top-0 z-10 backdrop-blur-2xs">
                        {tableHeaders.map((header, idx) => (
                          <th key={idx} className="px-6 py-4 text-xs font-bold tracking-wider uppercase border-r border-slate-800 last:border-0">
                            {header || `Ustun ${idx + 1}`}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-700 text-sm">
                      {tableData.length > 0 ? (
                        tableData.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50/80 transition-colors odd:bg-slate-50/20">
                            {tableHeaders.map((_, colIdx) => (
                              <td key={colIdx} className="px-6 py-3.5 border-r border-slate-100 last:border-0 font-medium text-slate-600 whitespace-nowrap">
                                {row[colIdx] !== undefined ? String(row[colIdx]) : <span className="text-slate-300">-</span>}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={tableHeaders.length || 1} className="text-center py-12 text-slate-400">
                            Faylda ko'rsatiladigan ma'lumotlar topilmadi.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          
          /* --- VIEW 2: ASOSIY MANBALAR RO'YXATI (MAIN PAGE) --- */
          <>
            {/* Header Sarlavha paneli */}
            <div className="relative border-b border-slate-200 pb-8 space-y-3">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-600/5 text-emerald-600 rounded-xl border border-emerald-500/10 shadow-sm">
                  <HiDocumentChartBar className="w-6 h-6" />
                </span>
                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
                  Gidrologik Raqamli Manbalar (Excel)
                </h2>
              </div>
              <p className="text-base text-slate-500 max-w-3xl leading-relaxed">
                Sirdaryo havzasiga oid tahliliy maʼlumotlar jadvallari. Fayllarni `.xlsx` formatida yuklab olishingiz yoki brauzerda onlayn rejimda jadval koʻrinishida tekshirishingiz mumkin.
              </p>
            </div>

            {/* FAYLLAR RO'YXATI PANELI (CARDS GRID) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {EXCEL_SOURCES.map((source) => (
                <div 
                  key={source.id}
                  className="group bg-slate-50/70 hover:bg-white border border-slate-200/70 hover:border-slate-300 rounded-2xl p-6 flex flex-col justify-between gap-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1 relative overflow-hidden"
                >
                  {/* Excel Yashil chiziq effekti */}
                  <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-emerald-500 transition-all duration-500" />
                  
                  <div className="space-y-4">
                    {/* Yuqori qism: Ikon va fayl hajmi */}
                    <div className="flex justify-between items-start">
                      <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <HiDocumentChartBar className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wide text-slate-400 bg-slate-200/40 px-2.5 py-1 rounded-lg uppercase">
                        {source.size}
                      </span>
                    </div>

                    {/* Fayl Nomi */}
                    <h4 className="text-[15px] font-bold text-slate-800 group-hover:text-slate-900 leading-snug line-clamp-2 transition-colors">
                      {source.name}
                    </h4>

                    {/* Detallar qatori */}
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 border-t border-slate-100 pt-3.5">
                      <span className="flex items-center gap-1.5">
                        <HiCircleStack className="w-3.5 h-3.5 text-slate-300" /> {source.sheetsCount} ta sahifa
                      </span>
                      <span>•</span>
                      <span>Sana: {source.date}</span>
                    </div>
                  </div>

                  {/* Pastki qism: Modern Ikki tugmali guruh (Preview & Download) */}
                  <div className="grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                    {/* Onlayn Ko'rish */}
                    <button
                      onClick={() => handlePreview(source)}
                      className="inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 hover:border-slate-300 text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-2xs"
                    >
                      <HiEye className="w-4 h-4 text-blue-500" /> Onlayn ko'rish
                    </button>

                    {/* Yuklab Olish */}
                    <a
                      href={source.fileUrl}
                      download
                      className="inline-flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl transition-all cursor-pointer shadow-sm shadow-slate-900/5 hover:shadow-emerald-600/10"
                    >
                      <HiArrowDownTray className="w-4 h-4" /> Yuklab olish
                    </a>
                  </div>

                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  )
}