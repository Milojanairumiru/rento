import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, Star, Fuel, Users, SlidersHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getVehicles } from '@/lib/vehicles'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

const vehicleTypes = ['all', 'sedan', 'suv', 'hatchback', 'van', 'truck', 'luxury', 'electric'] as const
const priceRanges = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $30', min: 0, max: 30 },
  { label: '$30 - $60', min: 30, max: 60 },
  { label: '$60 - $100', min: 60, max: 100 },
  { label: '$100+', min: 100, max: Infinity },
]

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <Link
      to={`/vehicles/${vehicle.id}`}
      className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all"
    >
      <div className="aspect-[16/10] overflow-hidden bg-muted relative">
        <img
          src={vehicle.images[0]}
          alt={vehicle.title}
          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-background/90 backdrop-blur-sm text-xs font-medium px-2 py-1 rounded-full capitalize">
            {vehicle.type}
          </span>
        </div>
        {vehicle.available && (
          <div className="absolute top-3 right-3">
            <span className="bg-primary text-white text-xs font-medium px-2 py-1 rounded-full">
              Available
            </span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-foreground truncate">{vehicle.title}</h3>
        <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{vehicle.location}</span>
          </div>
        </div>
        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Fuel className="h-3 w-3" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{vehicle.seats} seats</span>
          </div>
          <span className="capitalize">{vehicle.transmission}</span>
        </div>
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{vehicle.rating}</span>
            <span className="text-xs text-muted-foreground">({vehicle.totalTrips} trips)</span>
          </div>
          <span className="text-lg font-bold text-primary">
            ${vehicle.pricePerDay}<span className="text-xs font-normal text-muted-foreground">/day</span>
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function Browse() {
  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedPriceRange, setSelectedPriceRange] = useState(0)
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
      setVehicles(results)
      setLoading(false)
    }

    const debounce = setTimeout(fetchVehicles, 300)
    return () => clearTimeout(debounce)
  }, [search, selectedType, selectedPriceRange])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Browse Vehicles</h1>
        <p className="mt-1 text-muted-foreground">Find your perfect ride from trusted owners</p>
      </div>

      {/* Search & Filter Bar */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, brand, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
          />
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="sm:w-auto"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mt-4 p-4 border border-border rounded-lg bg-muted/30 space-y-4">
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Vehicle Type</h4>
            <div className="flex flex-wrap gap-2">
              {vehicleTypes.map((type) => (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors capitalize',
                    selectedType === type
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  )}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-medium text-foreground mb-2">Price Range</h4>
            <div className="flex flex-wrap gap-2">
              {priceRanges.map((range, i) => (
                <button
                  key={range.label}
                  onClick={() => setSelectedPriceRange(i)}
                  className={cn(
                    'px-3 py-1.5 text-xs font-medium rounded-full border transition-colors',
                    selectedPriceRange === i
                      ? 'bg-primary text-white border-primary'
                      : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
                  )}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="mt-6">
        <p className="text-sm text-muted-foreground mb-4">
          {loading ? 'Loading...' : `${vehicles.length} vehicle${vehicles.length !== 1 ? 's' : ''} found`}
        </p>
        {vehicles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <VehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        ) : !loading ? (
          <div className="text-center py-16">
            <Search className="h-12 w-12 text-muted-foreground/50 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-foreground">No vehicles found</h3>
            <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters or search terms</p>
          </div>
        ) : null}
      </div>
    </div>
  )
}
