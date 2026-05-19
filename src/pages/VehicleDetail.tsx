import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Fuel, Users, Calendar, ArrowLeft, Check, Gauge, Car, Share2, Heart, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { getVehicle, getVehicleReviews } from '@/lib/vehicles'
import { createBooking } from '@/lib/bookings'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import type { Vehicle, Review } from '@/types'

export default function VehicleDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [booked, setBooked] = useState(false)
  const [booking, setBooking] = useState(false)
  const [activeImage, setActiveImage] = useState(0)

  useEffect(() => {
    if (!id) return
    const load = async () => {
      const [v, r] = await Promise.all([getVehicle(id), getVehicleReviews(id)])
      setVehicle(v)
      setReviews(r)
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-64 bg-muted rounded-2xl"></div>
          <div className="h-6 bg-muted rounded w-2/3 mx-auto"></div>
          <div className="h-4 bg-muted rounded w-1/3 mx-auto"></div>
        </div>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <Car className="h-12 w-12 text-muted-foreground/40 mx-auto" />
        <h1 className="mt-4 text-2xl font-bold">Vehicle not found</h1>
        <Link to="/browse" className="mt-4 inline-block text-primary hover:underline">
          Back to browse
        </Link>
      </div>
    )
  }

  const days = startDate && endDate
    ? Math.max(1, Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)))
    : 0
  const total = days * vehicle.pricePerDay

  const handleBook = async () => {
    if (!isAuthenticated) {
      toast.error('Please log in to book a vehicle')
      navigate('/login')
      return
    }

    setBooking(true)
    const { error } = await createBooking({
      vehicleId: vehicle.id,
      renterId: user!.id,
      ownerId: vehicle.ownerId,
      startDate,
      endDate,
      totalPrice: total + 5,
    })

    if (error) {
      toast.error(error)
      setBooking(false)
      return
    }

    setBooked(true)
    setBooking(false)
    toast.success('Booking confirmed! The owner will be notified.')
  }

  const specs = [
    { icon: Users, label: 'Seats', value: `${vehicle.seats}` },
    { icon: Gauge, label: 'HP', value: '510' },
    { icon: Clock, label: 'Speed', value: '200 km/h' },
    { icon: Fuel, label: 'Fuel', value: vehicle.fuelType },
    { icon: Car, label: 'Type', value: vehicle.transmission === 'automatic' ? 'Auto' : 'Manual' },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center justify-between">
          <Link to="/browse" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <div className="flex items-center gap-2">
            <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Share2 className="h-4 w-4 text-muted-foreground" />
            </button>
            <button className="h-8 w-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Heart className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Car Title */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">{vehicle.brand} {vehicle.model}</h1>
              <p className="text-sm text-muted-foreground mt-1">{vehicle.title}</p>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2.5 py-1 rounded-full text-xs font-medium">
                  <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                  {vehicle.rating} ({vehicle.totalTrips} reviews)
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {vehicle.location}
                </div>
              </div>
            </div>

            {/* Image Gallery */}
            <div className="space-y-3">
              <div className="aspect-[16/9] rounded-2xl overflow-hidden bg-muted">
                <img
                  src={vehicle.images[activeImage]}
                  alt={vehicle.title}
                  className="h-full w-full object-cover"
                />
              </div>
              {vehicle.images.length > 1 && (
                <div className="flex gap-2">
                  {vehicle.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={cn(
                        'h-16 w-24 rounded-xl overflow-hidden border-2 transition-all',
                        activeImage === i ? 'border-primary shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                      )}
                    >
                      <img src={img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Specs Grid */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Specs</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col items-center gap-1.5 bg-muted/50 border border-border rounded-xl py-4 px-2">
                    <spec.icon className="h-5 w-5 text-primary" />
                    <span className="text-xs text-muted-foreground">{spec.label}</span>
                    <span className="text-sm font-semibold text-foreground capitalize">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pickup Info */}
            <div className="bg-muted/30 border border-border rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Pickup</h3>
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary-dark" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{vehicle.location}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vehicle pickup location</p>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Overview</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{vehicle.description}</p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">Features</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {vehicle.features.map((f) => (
                  <div key={f} className="flex items-center gap-2 bg-muted/40 rounded-lg px-3 py-2.5">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    <span className="text-sm text-foreground">{f}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Renter Details */}
            <div className="bg-card border border-border rounded-2xl p-5">
              <h3 className="text-lg font-semibold text-foreground mb-3">Renter Details</h3>
              <div className="flex items-center gap-3">
                {vehicle.ownerAvatar ? (
                  <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="h-12 w-12 rounded-full object-cover" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold">
                    {vehicle.ownerName.charAt(0)}
                  </div>
                )}
                <div className="flex-1">
                  <p className="font-medium text-foreground">{vehicle.ownerName}</p>
                  <p className="text-xs text-muted-foreground">{vehicle.location}</p>
                </div>
                <div className="flex gap-2">
                  <button className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <svg className="h-4 w-4 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </button>
                  <button className="h-9 w-9 rounded-full bg-primary-light flex items-center justify-center hover:bg-primary/20 transition-colors">
                    <svg className="h-4 w-4 text-primary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews */}
            {reviews.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">Reviews</h3>
                <div className="space-y-3">
                  {reviews.map((r) => (
                    <div key={r.id} className="bg-card border border-border rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        {r.renterAvatar ? (
                          <img src={r.renterAvatar} alt={r.renterName} className="h-9 w-9 rounded-full" />
                        ) : (
                          <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-foreground">
                            {r.renterName.charAt(0)}
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium text-foreground">{r.renterName}</p>
                          <div className="flex items-center gap-0.5 mt-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={cn(
                                  'h-3 w-3',
                                  i < r.rating ? 'fill-yellow-400 text-yellow-400' : 'fill-muted text-muted'
                                )}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">{r.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Booking */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-4">
              {/* Price Card */}
              <div className="border border-border rounded-2xl p-6 bg-card shadow-sm">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-bold text-primary">${vehicle.pricePerDay}</span>
                    <span className="text-muted-foreground text-sm">/day</span>
                  </div>
                  <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-0.5 rounded-full text-xs font-medium">
                    <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                    {vehicle.rating}
                  </div>
                </div>

                {booked ? (
                  <div className="mt-6 text-center py-6">
                    <div className="h-14 w-14 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-7 w-7 text-primary-dark" />
                    </div>
                    <h3 className="mt-3 font-semibold text-foreground">Booking Confirmed!</h3>
                    <p className="mt-1 text-sm text-muted-foreground">Check your dashboard for details.</p>
                    <Link to="/renter/dashboard">
                      <Button variant="outline" className="mt-4 w-full rounded-xl">View My Trips</Button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <div className="mt-5 space-y-3">
                      <div>
                        <label className="text-xs font-medium text-foreground">Pick-up Date</label>
                        <input
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-foreground">Return Date</label>
                        <input
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="mt-1 w-full h-11 px-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                      </div>
                    </div>

                    {days > 0 && (
                      <div className="mt-4 pt-4 border-t border-border space-y-2.5 text-sm">
                        <div className="flex justify-between text-muted-foreground">
                          <span>${vehicle.pricePerDay} x {days} day{days > 1 ? 's' : ''}</span>
                          <span className="font-medium text-foreground">${total}</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Service fee</span>
                          <span className="font-medium text-foreground">$5</span>
                        </div>
                        <div className="flex justify-between font-semibold text-foreground pt-2.5 border-t border-border text-base">
                          <span>Total</span>
                          <span className="text-primary">${total + 5}</span>
                        </div>
                      </div>
                    )}

                    <Button
                      className="w-full mt-5 rounded-xl h-12 text-base font-semibold"
                      size="lg"
                      disabled={days === 0 || booking}
                      onClick={handleBook}
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {booking ? 'Processing...' : days > 0 ? `Book for $${total + 5}` : 'Select dates to book'}
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
