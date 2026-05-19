import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Fuel, Users, Gauge, SlidersHorizontal, Heart, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVehicles } from '@/lib/vehicles'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

const vehicleTypes = [
  { id: 'all', label: 'All', icon: '🚗' },
  { id: 'sedan', label: 'Sedan', icon: '🚘' },
  { id: 'suv', label: 'SUV', icon: '🚐' },
  { id: 'hatchback', label: 'Hatchback', icon: '🚙' },
  { id: 'van', label: 'Van', icon: '🚌' },
  { id: 'truck', label: 'Truck', icon: '🛻' },
  { id: 'luxury', label: 'Luxury', icon: '✨' },
  { id: 'electric', label: 'Electric', icon: '⚡' },
]

const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 - $60', min: 30, max: 60 },
  { label: '$60 - $100', min: 60, max: 100 },
  { label: '$100+', min: 100, max: Infinity },
]

const transmissions = [
  { id: 'all', label: 'All' },
  { id: 'automatic', label: 'Automatic' },
  { id: 'manual', label: 'Manual' },
]

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        <img
          src={vehicle.images[0]}
          alt={vehicle.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <button
          onClick={(e) => e.preventDefault()}
          className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {vehicle.rating} ({vehicle.totalTrips})
        </div>
        <div className="absolute top-3 left-3">
          <span className="bg-primary/90 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full capitalize">
            {vehicle.type}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">{vehicle.title}</h3>

        {/* Specs */}
        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="flex flex-col items-center gap-1 bg-muted/50 rounded-lg py-2 px-1">
            <Users className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground">{vehicle.seats} Seats</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-muted/50 rounded-lg py-2 px-1">
            <Fuel className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex flex-col items-center gap-1 bg-muted/50 rounded-lg py-2 px-1">
            <Gauge className="h-3.5 w-3.5 text-primary" />
            <span className="text-[10px] text-muted-foreground capitalize">{vehicle.transmission === 'automatic' ? 'Auto' : 'Manual'}</span>
          </div>
        </div>

        {/* Price & Location */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="truncate max-w-[100px]">{vehicle.location}</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold text-primary">${vehicle.pricePerDay}</span>
            <span className="text-xs text-muted-foreground">/day</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function Browse() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
  const [selectedTransmission, setSelectedTransmission] = useState('all')
  const [showFilters, setShowFilters] = useState(false)
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true)
      const range = priceRanges[selectedPriceRange]
      const results = await getVehicles({
        type: selectedType,
        minPrice: range.min,
        maxPrice: range.max,
        search: search || undefined,
      })
      // Filter by transmission client-side
      const filtered = selectedTransmission === 'all'
        ? results
        : results.filter((v) => v.transmission === selectedTransmission)
      setVehicles(filtered)
      setLoading(false)
    }

    const debounce = setTimeout(fetchVehicles, 300)
    return () => clearTimeout(debounce)
  }, [search, selectedType, selectedPriceRange, selectedTransmission])

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-b from-navy/5 to-background pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Browse Vehicles</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Find your perfect ride</p>
            </div>
            <Button
              variant={showFilters ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="rounded-xl"
            >
              <SlidersHorizontal className="h-4 w-4 mr-1.5" />
              Filters
            </Button>
          </div>

          {/* Search */}
          <div className="mt-4 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, brand, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {vehicleTypes.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedType(type.id)}
                className={cn(
                  'flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium whitespace-nowrap transition-all',
                  selectedType === type.id
                    ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                    : 'bg-card text-muted-foreground border-border hover:border-primary/50'
                )}
              >
                <span>{type.icon}</span>
                <span>{type.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-4">
          <div className="p-4 border border-border rounded-2xl bg-card shadow-sm space-y-4">
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Price Range</h4>
              <div className="flex flex-wrap gap-2">
                {priceRanges.map((range, i) => (
                  <button
                    key={range.label}
                    onClick={() => setSelectedPriceRange(i)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                      selectedPriceRange === i
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    )}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-2">Transmission</h4>
              <div className="flex flex-wrap gap-2">
                {transmissions.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTransmission(t.id)}
                    className={cn(
                      'px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors',
                      selectedTransmission === t.id
                        ? 'bg-primary text-white border-primary'
                        : 'bg-background text-muted-foreground border-border hover:border-primary/50'
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4 pb-12">
        <p className="text-xs text-muted-foreground mb-4">
          {loading ? 'Searching...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`}
        </p>

        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-20 bg-muted/30 rounded-2xl">
            <Search className="h-12 w-12 text-muted-foreground/40 mx-auto" />
            <h3 className="mt-4 text-base font-semibold text-foreground">No vehicles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4 rounded-xl"
              onClick={() => {
                setSearch('')
                setSelectedType('all')
                setSelectedPriceRange(0)
                setSelectedTransmission('all')
              }}
            >
              Clear all filters
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  )
}
