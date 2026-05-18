import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Car, Shield, MapPin, Clock, Star, Users } from 'lucide-react'
import { mockVehicles } from '@/lib/mock-data'

function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-light/30 via-background to-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">
            Rent Smarter.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-lg">
            Find the perfect vehicle from trusted owners in your area. Book instantly, drive freely.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/browse">
              <Button size="lg" className="w-full sm:w-auto">
                Browse Vehicles
              </Button>
            </Link>
            <Link to="/list-vehicle">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                List Your Vehicle
              </Button>
            </Link>
          </div>
          <div className="mt-10 flex items-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Car className="h-4 w-4 text-primary" />
              <span>500+ Vehicles</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="h-4 w-4 text-primary" />
              <span>10k+ Users</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Star className="h-4 w-4 text-primary" />
              <span>4.8 Rating</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

const features = [
  {
    icon: MapPin,
    title: 'Find Nearby',
    description: 'Discover vehicles available right in your neighborhood. Filter by location, type, and price.',
  },
  {
    icon: Shield,
    title: 'Trusted & Verified',
    description: 'All owners and vehicles are verified. Every booking is covered by our protection plan.',
  },
  {
    icon: Clock,
    title: 'Instant Booking',
    description: 'Book in seconds. Pick up the keys and hit the road. No paperwork, no hassle.',
  },
]

function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground">How It Works</h2>
          <p className="mt-3 text-muted-foreground">
            Renting a vehicle has never been easier. Three simple steps.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="bg-card rounded-xl p-6 border border-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="h-10 w-10 rounded-lg bg-primary-light flex items-center justify-center">
                <feature.icon className="h-5 w-5 text-primary-dark" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-foreground">{feature.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function FeaturedVehicles() {
  const featured = mockVehicles.slice(0, 3)

  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-foreground">Featured Vehicles</h2>
            <p className="mt-2 text-muted-foreground">Top-rated vehicles from trusted owners</p>
          </div>
          <Link to="/browse">
            <Button variant="outline">View All</Button>
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((vehicle) => (
            <Link
              key={vehicle.id}
              to={`/vehicles/${vehicle.id}`}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={vehicle.images[0]}
                  alt={vehicle.title}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground truncate">{vehicle.title}</h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{vehicle.location}</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-primary text-primary" />
                    <span className="text-sm font-medium">{vehicle.rating}</span>
                    <span className="text-xs text-muted-foreground">({vehicle.totalTrips} trips)</span>
                  </div>
                  <span className="text-lg font-bold text-primary">${vehicle.pricePerDay}<span className="text-xs font-normal text-muted-foreground">/day</span></span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl font-bold text-white">Got a vehicle sitting idle?</h2>
        <p className="mt-3 text-primary-light max-w-lg mx-auto">
          Turn your parked car into passive income. List it on Rento and start earning today.
        </p>
        <Link to="/list-vehicle">
          <Button size="lg" className="mt-6 bg-white text-primary hover:bg-white/90">
            Start Earning
          </Button>
        </Link>
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <FeaturedVehicles />
      <CTA />
    </>
  )
}
