import { supabase, isSupabaseConfigured } from './supabase'
import { mockBookings } from './mock-data'
import type { Booking } from '@/types'

// Create a new booking
export async function createBooking(booking: {
  vehicleId: string
  renterId: string
  ownerId: string
  startDate: string
  endDate: string
  totalPrice: number
}): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { id: 'mock-booking-' + Date.now(), error: null }
  }

  const { data, error } = await supabase
    .from('bookings')
    .insert({
      vehicle_id: booking.vehicleId,
      renter_id: booking.renterId,
      owner_id: booking.ownerId,
      start_date: booking.startDate,
      end_date: booking.endDate,
      total_price: booking.totalPrice,
      status: 'pending' as const,
    })
    .select('id')
    .single()

  if (error) return { id: null, error: error.message }
  return { id: data?.id || null, error: null }
}

// Get bookings for a renter
export async function getRenterBookings(renterId: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return mockBookings.filter((b) => b.renterId === renterId)
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      vehicles:vehicle_id(title, images),
      renter:renter_id(name),
      owner:owner_id(name)
    `)
    .eq('renter_id', renterId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => toBooking(row))
}

// Get bookings for an owner
export async function getOwnerBookings(ownerId: string): Promise<Booking[]> {
  if (!isSupabaseConfigured()) {
    return mockBookings.filter((b) => b.ownerId === ownerId)
  }

  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      vehicles:vehicle_id(title, images),
      renter:renter_id(name),
      owner:owner_id(name)
    `)
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error || !data) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((row: any) => toBooking(row))
}

// Update booking status
export async function updateBookingStatus(
  bookingId: string,
  status: 'confirmed' | 'cancelled' | 'completed'
): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }

  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId)

  return { error: error?.message || null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toBooking(row: any): Booking {
  return {
    id: row.id,
    vehicleId: row.vehicle_id,
    vehicleTitle: row.vehicles?.title || 'Unknown Vehicle',
    vehicleImage: row.vehicles?.images?.[0] || '',
    renterId: row.renter_id,
    renterName: row.renter?.name || 'Unknown',
    ownerId: row.owner_id,
    ownerName: row.owner?.name || 'Unknown',
    startDate: row.start_date,
    endDate: row.end_date,
    totalPrice: Number(row.total_price),
    status: row.status,
    createdAt: row.created_at,
  }
}
