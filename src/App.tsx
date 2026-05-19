import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import Home from '@/pages/Home'
import Browse from '@/pages/Browse'
import MapView from '@/pages/MapView'
import VehicleDetail from '@/pages/VehicleDetail'
import ListVehicle from '@/pages/ListVehicle'
import OwnerDashboard from '@/pages/OwnerDashboard'
import RenterDashboard from '@/pages/RenterDashboard'
import Login from '@/pages/Login'
import Signup from '@/pages/Signup'
import NotFound from '@/pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/browse" element={<Browse />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/vehicles/:id" element={<VehicleDetail />} />
              <Route path="/list-vehicle" element={<ListVehicle />} />
              <Route path="/owner/dashboard" element={<OwnerDashboard />} />
              <Route path="/renter/dashboard" element={<RenterDashboard />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" richColors closeButton />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
