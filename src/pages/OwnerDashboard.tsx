import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Car, Plus, DollarSign, Calendar, Star, CheckCircle, XCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getOwnerVehicles } from '@/lib/vehicles'
import { getOwnerBookings, updateBookingStatus } from '@/lib/bookings'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import type { Vehicle, Booking } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function OwnerDashboard() {
  const { user, isAuthenticated, profile } = useAuth()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const [v, b] = await Promise.all([
        getOwnerVehicles(user.id),
        getOwnerBookings(user.id),
      ])
      setVehicles(v)
      setBookings(b)
      setLoading(false)
    }
    load()
  }, [user])

  const handleApprove = async (bookingId: string) => {
    const { error } = await updateBookingStatus(bookingId, 'confirmed')
    if (error) { toast.error(error); return }
    toast.success('Booking approved!')
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'confirmed' } : b))
  }

  const handleReject = async (bookingId: string) => {
    const { error } = await updateBookingStatus(bookingId, 'cancelled')
    if (error) { toast.error(error); return }
    toast.info('Booking rejected')
    setBookings((prev) => prev.map((b) => b.id === bookingId ? { ...b, status: 'cancelled' } : b))
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Please log in to view your dashboard</h2>
        <Link to="/login"><Button className="mt-4">Log In</Button></Link>
      </div>
    )
  }

  const totalRevenue = bookings.filter((b) => b.status === 'completed' || b.status === 'confirmed').reduce((sum, b) => sum + b.totalPrice, 0)

  const stats = [
    { label: 'Listed Vehicles', value: vehicles.length, icon: Car },
    { label: 'Total Bookings', value: bookings.length, icon: Calendar },
    { label: 'Revenue', value: '$' + totalRevenue, icon: DollarSign },
    { label: 'Avg Rating', value: profile?.rating || '0', icon: Star },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Owner Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Manage your vehicles and bookings</p>
        </div>
        <Link to="/list-vehicle">
          <Button><Plus className="h-4 w-4 mr-2" /> Add Vehicle</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-xl p-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary-light flex items-center justify-center">
                <stat.icon className="h-4 w-4 text-primary-dark" />
              </div>
            </div>
            <p className="mt-3 text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* My Vehicles */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">My Vehicles</h2>
        {loading ? (
          <p className="mt-4 text-muted-foreground">Loading...</p>
        ) : vehicles.length > 0 ? (
          <div className="mt-4 space-y-3">
            {vehicles.map((v) => (
              <Link key={v.id} to={`/vehicles/${v.id}`} className="flex items-center gap-4 border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
                <img src={v.images[0]} alt={v.title} className="h-16 w-24 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">{v.title}</h3>
                  <p className="text-sm text-muted-foreground">{v.location} &middot; ${v.pricePerDay}/day</p>
                </div>
                <span className={cn('px-2 py-1 text-xs font-medium rounded-full', v.available ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800')}>
                  {v.available ? 'Active' : 'Inactive'}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-10 border border-dashed border-border rounded-xl">
            <Car className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">No vehicles listed yet</p>
            <Link to="/list-vehicle"><Button variant="outline" className="mt-3" size="sm">List a Vehicle</Button></Link>
          </div>
        )}
      </div>

      {/* Recent Bookings */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Recent Bookings</h2>
        {bookings.length > 0 ? (
          <div className="mt-4 space-y-3">
            {bookings.map((b) => (
              <div key={b.id} className="flex items-center gap-4 border border-border rounded-lg p-4">
                <img src={b.vehicleImage} alt={b.vehicleTitle} className="h-12 w-18 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">{b.vehicleTitle}</h3>
                  <p className="text-xs text-muted-foreground">Renter: {b.renterName} &middot; {b.startDate} to {b.endDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => handleApprove(b.id)} className="p-1.5 rounded-md bg-green-100 hover:bg-green-200 text-green-700 transition-colors" title="Approve">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button onClick={() => handleReject(b.id)} className="p-1.5 rounded-md bg-red-100 hover:bg-red-200 text-red-700 transition-colors" title="Reject">
                        <XCircle className="h-4 w-4" />
                      </button>
                    </>
                  )}
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', statusColors[b.status])}>
                    {b.status}
                  </span>
                  <p className="text-sm font-semibold text-foreground">${b.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No bookings yet.</p>
        )}
      </div>
    </div>
  )
}
