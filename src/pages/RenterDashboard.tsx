import { Link } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import { getRenterBookings } from '@/lib/bookings'
import { cn } from '@/lib/utils'
import type { Booking } from '@/types'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  active: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
}

export default function RenterDashboard() {
  const { user, isAuthenticated } = useAuth()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      if (!user) return
      const data = await getRenterBookings(user.id)
      setBookings(data)
      setLoading(false)
    }
    load()
  }, [user])

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-20 text-center">
        <h2 className="text-xl font-bold">Please log in to view your trips</h2>
        <Link to="/login"><Button className="mt-4">Log In</Button></Link>
      </div>
    )
  }

  const upcoming = bookings.filter((b) => b.status === 'confirmed' || b.status === 'pending')
  const past = bookings.filter((b) => b.status === 'completed' || b.status === 'cancelled')

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">My Trips</h1>
          <p className="mt-1 text-muted-foreground">View your upcoming and past bookings</p>
        </div>
        <Link to="/browse">
          <Button>Browse Vehicles</Button>
        </Link>
      </div>

      {/* Upcoming */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">Upcoming Trips</h2>
        {loading ? (
          <p className="mt-4 text-muted-foreground">Loading...</p>
        ) : upcoming.length > 0 ? (
          <div className="mt-4 space-y-4">
            {upcoming.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row items-start sm:items-center gap-4 border border-border rounded-xl p-5 bg-card hover:shadow-sm transition-shadow">
                <img src={b.vehicleImage} alt={b.vehicleTitle} className="h-20 w-32 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground">{b.vehicleTitle}</h3>
                  <div className="mt-1 flex items-center gap-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {b.startDate} — {b.endDate}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Owner: {b.ownerName}</p>
                </div>
                <div className="text-right">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', statusColors[b.status])}>
                    {b.status}
                  </span>
                  <p className="mt-2 text-lg font-bold text-primary">${b.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4 text-center py-10 border border-dashed border-border rounded-xl">
            <Calendar className="h-10 w-10 text-muted-foreground/50 mx-auto" />
            <p className="mt-2 text-sm text-muted-foreground">No upcoming trips</p>
            <Link to="/browse">
              <Button variant="outline" className="mt-3" size="sm">Find a Vehicle</Button>
            </Link>
          </div>
        )}
      </div>

      {/* Past */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-foreground">Past Trips</h2>
        {past.length > 0 ? (
          <div className="mt-4 space-y-3">
            {past.map((b) => (
              <div key={b.id} className="flex items-center gap-4 border border-border rounded-lg p-4 opacity-75">
                <img src={b.vehicleImage} alt={b.vehicleTitle} className="h-12 w-18 rounded-md object-cover" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground text-sm truncate">{b.vehicleTitle}</h3>
                  <p className="text-xs text-muted-foreground">{b.startDate} — {b.endDate}</p>
                </div>
                <div className="text-right">
                  <span className={cn('px-2 py-1 text-xs font-medium rounded-full capitalize', statusColors[b.status])}>
                    {b.status}
                  </span>
                  <p className="mt-1 text-sm font-medium">${b.totalPrice}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">No past trips yet.</p>
        )}
      </div>
    </div>
  )
}
