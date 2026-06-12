import { BrowserRouter, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import About from './pages/About'
import Home from './pages/Home'
import MapPage from './pages/MapPage'
import './index.css'
import Footer from './components/Footer'
import LiteraturePage from './pages/LiteraturePage'
import SourcesPage from './pages/SourcesPage'
import AtmosphereDashboard from './pages/AtmospherePage'
import YashilMakonDashboard from './pages/YashilMakonDashboard'

function AppLayout() {
  const { pathname } = useLocation()
  const isMapPage = pathname.startsWith('/xarita')

  return (
    <div className="app-wrapper">
      {!isMapPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/biz-haqimizda" element={<About />} />
        <Route path="/xarita" element={<MapPage activeTab="overview" />} />
        <Route path="/xarita/suv" element={<MapPage activeTab="water" />} />
        <Route path="/xarita/chiqindi" element={<MapPage activeTab="waste" />} />
        <Route path="/xarita/atmosfera" element={<MapPage activeTab="atmosphere" />} />
        <Route path="/xarita/yashil-makon" element={<MapPage activeTab="green" />} />
        <Route path="/atmosphere" element={<AtmosphereDashboard />} />
        <Route path="/green-place" element={<YashilMakonDashboard />} />
        <Route path="/adabiyotlar" element={<LiteraturePage/>} />
        <Route path='/source' element={<SourcesPage/>}/>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {!isMapPage && <Footer />}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}
