import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { AppHeader } from '@/components/layout/AppHeader'
import { BottomNav } from '@/components/layout/BottomNav'
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

// Pages where we hide the bottom nav (full-screen experiences)
const hideBottomNavPaths = ['/login', '/signup', '/vehicles/']

function AppLayout() {
  const location = useLocation()
  const hideNav = hideBottomNavPaths.some((path) =>
    path.endsWith('/') ? location.pathname.startsWith(path) : location.pathname === path
  )
  const isMapPage = location.pathname === '/map'

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Compact app header - hidden on map for full screen */}
      {!isMapPage && !hideNav && <AppHeader />}

      {/* Main content area with bottom padding for nav */}
      <main className={`flex-1 ${!hideNav && !isMapPage ? 'pb-16' : ''} ${isMapPage ? '' : ''}`}>
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

      {/* Bottom navigation - app style */}
      {!hideNav && <BottomNav />}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
        <Toaster position="top-center" richColors closeButton />
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
