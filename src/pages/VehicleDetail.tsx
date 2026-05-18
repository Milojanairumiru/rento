import { useParams, Link, useNavigate } from 'react-router-dom'
import { MapPin, Star, Fuel, Users, Calendar, ArrowLeft, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { getVehicle, getVehicleReviews } from '@/lib/vehicles'
import { createBooking } from '@/lib/bookings'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
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
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">Vehicle not found</h1>
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

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/browse" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowLeft className="h-4 w-4" /> Back to browse
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Images & Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {vehicle.images.map((img, i) => (
              <div key={i} className="aspect-[16/10] rounded-xl overflow-hidden bg-muted">
                <img src={img} alt={vehicle.title} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{vehicle.title}</h1>
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1"><MapPin className="h-4 w-4" /> {vehicle.location}</span>
              <span className="flex items-center gap-1"><Star className="h-4 w-4 fill-primary text-primary" /> {vehicle.rating} ({vehicle.totalTrips} trips)</span>
              <span className="flex items-center gap-1"><Fuel className="h-4 w-4" /> {vehicle.fuelType}</span>
              <span className="flex items-center gap-1"><Users className="h-4 w-4" /> {vehicle.seats} seats</span>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">About this vehicle</h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{vehicle.description}</p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground">Features</h3>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {vehicle.features.map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 text-primary" /> {f}
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Type', value: vehicle.type },
              { label: 'Transmission', value: vehicle.transmission },
              { label: 'Fuel', value: vehicle.fuelType },
              { label: 'Year', value: vehicle.year },
            ].map((s) => (
              <div key={s.label} className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-sm font-medium text-foreground capitalize">{String(s.value)}</p>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-3 p-4 border border-border rounded-lg">
            {vehicle.ownerAvatar ? (
              <img src={vehicle.ownerAvatar} alt={vehicle.ownerName} className="h-10 w-10 rounded-full" />
            ) : (
              <div className="h-10 w-10 rounded-full bg-primary-light flex items-center justify-center text-primary-dark font-bold text-sm">
                {vehicle.ownerName.charAt(0)}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-foreground">{vehicle.ownerName}</p>
              <p className="text-xs text-muted-foreground">Vehicle Owner</p>
            </div>
          </div>

          {reviews.length > 0 && (
            <div>
              <h3 className="font-semibold text-foreground">Reviews</h3>
              <div className="mt-3 space-y-4">
                {reviews.map((r) => (
                  <div key={r.id} className="border border-border rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      {r.renterAvatar ? (
                        <img src={r.renterAvatar} alt={r.renterName} className="h-8 w-8 rounded-full" />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                          {r.renterName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium">{r.renterName}</p>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: r.rating }).map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                          ))}
                        </div>
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-1">
          <div className="sticky top-24 border border-border rounded-xl p-6 bg-card shadow-sm">
            <div className="text-center mb-4">
              <span className="text-3xl font-bold text-primary">${vehicle.pricePerDay}</span>
              <span className="text-muted-foreground">/day</span>
            </div>

            {booked ? (
              <div className="text-center py-6">
                <div className="h-12 w-12 bg-primary-light rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-6 w-6 text-primary-dark" />
                </div>
                <h3 className="mt-3 font-semibold text-foreground">Booking Confirmed!</h3>
                <p className="mt-1 text-sm text-muted-foreground">Check your dashboard for details.</p>
                <Link to="/renter/dashboard">
                  <Button variant="outline" className="mt-4 w-full">View My Trips</Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-foreground">Pick-up Date</label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-foreground">Return Date</label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </div>

                {days > 0 && (
                  <div className="mt-4 pt-4 border-t border-border space-y-2 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>${vehicle.pricePerDay} x {days} day{days > 1 ? 's' : ''}</span>
                      <span>${total}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee</span>
                      <span>$5</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground pt-2 border-t border-border">
                      <span>Total</span>
                      <span>${total + 5}</span>
                    </div>
                  </div>
                )}

                <Button
                  className="w-full mt-4"
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
  )
}
