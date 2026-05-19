import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { MapPin, Star, Users, Navigation, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVehicles } from '@/lib/vehicles'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'
import 'leaflet/dist/leaflet.css'

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: unknown })._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

// Custom car marker icon
const carIcon = new L.DivIcon({
  className: 'custom-car-marker',
  html: `<div style="background:#f5c518;width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3);border:3px solid #1a1a2e;">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1a1a2e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.5 2.8C1.4 11.3 1 12.1 1 13v3c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><path d="M9 17h6"/><circle cx="17" cy="17" r="2"/></svg>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
  popupAnchor: [0, -20],
})

// Component to fly to user's location
function LocationButton() {
  const map = useMap()
  const [locating, setLocating] = useState(false)

  const handleLocate = () => {
    setLocating(true)
    map.locate({ setView: true, maxZoom: 14 })
    map.once('locationfound', () => setLocating(false))
    map.once('locationerror', () => setLocating(false))
  }

  return (
    <button
      onClick={handleLocate}
      className="absolute bottom-6 right-4 z-[1000] bg-white shadow-lg rounded-full h-12 w-12 flex items-center justify-center hover:bg-muted transition-colors border border-border"
      title="Find my location"
    >
      <Navigation className={cn('h-5 w-5 text-navy', locating && 'animate-pulse')} />
    </button>
  )
}

// Vehicle card in sidebar
function VehicleListItem({ vehicle, isActive, onClick }: { vehicle: Vehicle; isActive: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'p-3 rounded-xl border cursor-pointer transition-all',
        isActive
          ? 'border-primary bg-primary-light/30 shadow-sm'
          : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
      )}
    >
      <div className="flex gap-3">
        <img
          src={vehicle.images[0]}
          alt={vehicle.title}
          className="h-16 w-24 rounded-lg object-cover flex-shrink-0"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-foreground truncate">{vehicle.title}</h3>
          <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-0.5">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              {vehicle.rating}
            </span>
            <span className="flex items-center gap-0.5">
              <Users className="h-3 w-3" />
              {vehicle.seats}
            </span>
            <span className="capitalize">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="text-xs text-muted-foreground flex items-center gap-0.5">
              <MapPin className="h-3 w-3" />
              {vehicle.location}
            </span>
            <span className="text-sm font-bold text-primary">${vehicle.pricePerDay}/day</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function MapView() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null)
  const [search, setSearch] = useState('')
  const [showList, setShowList] = useState(true)

  // Default center: Colombo, Sri Lanka
  const defaultCenter: [number, number] = [6.9271, 79.8612]

  useEffect(() => {
    const load = async () => {
      const results = await getVehicles({ search: search || undefined })
      setVehicles(results)
      setLoading(false)
    }
    const debounce = setTimeout(load, 300)
    return () => clearTimeout(debounce)
  }, [search])

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col md:flex-row relative">
      {/* Sidebar - Vehicle List */}
      <div
        className={cn(
          'w-full md:w-[380px] bg-background border-r border-border flex flex-col z-10 transition-all',
          showList ? 'h-[40vh] md:h-full' : 'h-0 md:h-full overflow-hidden md:overflow-visible'
        )}
      >
        {/* Search Header */}
        <div className="p-4 border-b border-border space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Nearby Vehicles</h2>
            <button
              onClick={() => setShowList(!showList)}
              className="md:hidden text-xs text-primary font-medium"
            >
              {showList ? 'Hide List' : 'Show List'}
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search vehicles nearby..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-10 pl-10 pr-8 rounded-xl border border-border bg-card text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="h-4 w-4 text-muted-foreground" />
              </button>
            )}
          </div>
          <p className="text-xs text-muted-foreground">
            {loading ? 'Loading...' : `${vehicles.length} vehicles available`}
          </p>
        </div>

        {/* Vehicle List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {vehicles.map((vehicle) => (
            <VehicleListItem
              key={vehicle.id}
              vehicle={vehicle}
              isActive={selectedVehicle?.id === vehicle.id}
              onClick={() => setSelectedVehicle(vehicle)}
            />
          ))}
        </div>
      </div>

      {/* Toggle List Button (mobile) */}
      <button
        onClick={() => setShowList(!showList)}
        className="md:hidden absolute top-2 left-1/2 -translate-x-1/2 z-[1000] bg-white shadow-lg rounded-full px-4 py-2 text-xs font-medium text-navy border border-border"
        style={{ top: showList ? 'calc(40vh + 8px)' : '8px' }}
      >
        {showList ? '▼ Show Map' : '▲ Show List'}
      </button>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={defaultCenter}
          zoom={10}
          className="h-full w-full z-0"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {vehicles.map((vehicle) => (
            <Marker
              key={vehicle.id}
              position={[vehicle.latitude, vehicle.longitude]}
              icon={carIcon}
              eventHandlers={{
                click: () => setSelectedVehicle(vehicle),
              }}
            >
              <Popup>
                <div className="w-56 p-0">
                  <img
                    src={vehicle.images[0]}
                    alt={vehicle.title}
                    className="w-full h-28 object-cover rounded-t-lg"
                  />
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-foreground truncate">{vehicle.title}</h3>
                    <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        {vehicle.rating}
                      </span>
                      <span>{vehicle.seats} seats</span>
                      <span className="capitalize">{vehicle.fuelType}</span>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-lg font-bold text-primary">${vehicle.pricePerDay}/day</span>
                      <Link to={`/vehicles/${vehicle.id}`}>
                        <Button size="sm" className="h-7 text-xs rounded-lg">
                          Book Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          <LocationButton />
        </MapContainer>

        {/* Selected Vehicle Card (floating on map) */}
        {selectedVehicle && (
          <div className="absolute bottom-6 left-4 right-4 md:left-4 md:right-auto md:w-80 z-[1000]">
            <div className="bg-card border border-border rounded-2xl shadow-xl p-4">
              <button
                onClick={() => setSelectedVehicle(null)}
                className="absolute top-2 right-2 h-6 w-6 bg-muted rounded-full flex items-center justify-center"
              >
                <X className="h-3 w-3" />
              </button>
              <div className="flex gap-3">
                <img
                  src={selectedVehicle.images[0]}
                  alt={selectedVehicle.title}
                  className="h-20 w-28 rounded-xl object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground">{selectedVehicle.title}</h3>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span>{selectedVehicle.rating} ({selectedVehicle.totalTrips} trips)</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    <span>{selectedVehicle.location}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-base font-bold text-primary">${selectedVehicle.pricePerDay}/day</span>
                    <Link to={`/vehicles/${selectedVehicle.id}`}>
                      <Button size="sm" className="h-8 text-xs rounded-lg">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
