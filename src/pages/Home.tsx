import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Star, Fuel, Users, Gauge, ChevronRight, Heart } from 'lucide-react'
import { mockVehicles } from '@/lib/mock-data'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import type { Vehicle } from '@/types'

const categories = [
  { id: 'all', label: 'All', icon: '🚗' },
  { id: 'hatchback', label: 'Hatchback', icon: '🚙' },
  { id: 'sedan', label: 'Sedan', icon: '🚘' },
  { id: 'suv', label: 'SUV', icon: '🚐' },
  { id: 'truck', label: 'Truck', icon: '🛻' },
  { id: 'luxury', label: 'Luxury', icon: '✨' },
  { id: 'electric', label: 'Electric', icon: '⚡' },
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
        <button className="absolute top-3 right-3 h-8 w-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors">
          <Heart className="h-4 w-4 text-muted-foreground" />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          {vehicle.rating}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold text-foreground text-sm leading-tight line-clamp-1">{vehicle.title}</h3>
        </div>

        {/* Specs Row */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span>{vehicle.seats} Seats</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Fuel className="h-3.5 w-3.5" />
            <span className="capitalize">{vehicle.fuelType}</span>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Gauge className="h-3.5 w-3.5" />
            <span className="capitalize">{vehicle.transmission}</span>
          </div>
        </div>

        {/* Price & Location */}
        <div className="mt-3 pt-3 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span>{vehicle.location}</span>
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

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredVehicles = mockVehicles.filter((v) => {
    const matchesCategory = selectedCategory === 'all' || v.type === selectedCategory
    const matchesSearch = searchQuery === '' ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 via-background to-primary/3 pb-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-6">
          {/* Location & Greeting */}
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-1.5 text-primary">
                <MapPin className="h-4 w-4" />
                <span className="text-sm font-medium">California, US</span>
                <ChevronRight className="h-3.5 w-3.5 rotate-90" />
              </div>
              <h1 className="mt-2 text-2xl md:text-3xl font-bold text-foreground">
                Let's find your favourite<br />car here
              </h1>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-6 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Find your car"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-border bg-card text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          {/* Category Chips */}
          <div className="mt-6">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">The most searched cars</p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium whitespace-nowrap transition-all',
                    selectedCategory === cat.id
                      ? 'bg-primary text-white border-primary shadow-md shadow-primary/25'
                      : 'bg-card text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                  )}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-semibold text-foreground">
              {selectedCategory === 'all' ? 'Available Vehicles' : `${categories.find(c => c.id === selectedCategory)?.label || ''} Cars`}
            </h2>
            <Link to="/browse" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View All <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-muted/30 rounded-2xl">
              <Search className="h-10 w-10 text-muted-foreground/50 mx-auto" />
              <h3 className="mt-3 text-base font-medium text-foreground">No vehicles found</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try a different category or search term</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-gradient-to-r from-primary to-primary-dark">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Got a vehicle sitting idle?</h2>
          <p className="mt-3 text-primary-light/80 max-w-md mx-auto text-sm">
            Turn your parked car into passive income. List it on Rento and start earning today.
          </p>
          <Link to="/list-vehicle">
            <Button size="lg" className="mt-6 bg-white text-primary hover:bg-white/90 shadow-lg">
              Start Earning
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
