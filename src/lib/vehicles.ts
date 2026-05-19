import { supabase, isSupabaseConfigured } from './supabase'
import { mockVehicles, mockReviews } from './mock-data'
import type { Vehicle, Review } from '@/types'

// Get all vehicles (with optional filters)
export async function getVehicles(filters?: {
  type?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}): Promise<Vehicle[]> {
  if (!isSupabaseConfigured()) {
    let results = [...mockVehicles]
    if (filters?.type && filters.type !== 'all') {
      results = results.filter((v) => v.type === filters.type)
    }
    if (filters?.minPrice) {
      results = results.filter((v) => v.pricePerDay >= filters.minPrice!)
    }
    if (filters?.maxPrice && filters.maxPrice !== Infinity) {
      results = results.filter((v) => v.pricePerDay <= filters.maxPrice!)
    }
    if (filters?.search) {
      const s = filters.search.toLowerCase()
      results = results.filter(
        (v) =>
          v.title.toLowerCase().includes(s) ||
          v.location.toLowerCase().includes(s) ||
          v.brand.toLowerCase().includes(s)
      )
    }
    return results
  }

  let query = supabase
    .from('vehicles')
    .select('*, profiles!vehicles_owner_id_fkey(name, avatar_url)')
    .eq('available', true)
    .order('created_at', { ascending: false })

  if (filters?.type && filters.type !== 'all') {
    query = query.eq('type', filters.type as 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric')
  }
  if (filters?.minPrice) {
    query = query.gte('price_per_day', filters.minPrice)
  }
  if (filters?.maxPrice && filters.maxPrice !== Infinity) {
    query = query.lte('price_per_day', filters.maxPrice)
  }
  if (filters?.search) {
    query = query.or(
      `title.ilike.%${filters.search}%,location.ilike.%${filters.search}%,brand.ilike.%${filters.search}%`
    )
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching vehicles:', error)
    return mockVehicles
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => toVehicle(row))
}

// Get single vehicle by ID
export async function getVehicle(id: string): Promise<Vehicle | null> {
  if (!isSupabaseConfigured()) {
    return mockVehicles.find((v) => v.id === id) || null
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, profiles!vehicles_owner_id_fkey(name, avatar_url)')
    .eq('id', id)
    .single()

  if (error || !data) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return toVehicle(data as any)
}

// Get vehicles by owner
export async function getOwnerVehicles(ownerId: string): Promise<Vehicle[]> {
  if (!isSupabaseConfigured()) {
    return mockVehicles.filter((v) => v.ownerId === ownerId)
  }

  const { data, error } = await supabase
    .from('vehicles')
    .select('*, profiles!vehicles_owner_id_fkey(name, avatar_url)')
    .eq('owner_id', ownerId)
    .order('created_at', { ascending: false })

  if (error) return []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data || []).map((row: any) => toVehicle(row))
}

// Create a new vehicle listing
export async function createVehicle(vehicle: {
  owner_id: string
  title: string
  brand: string
  model: string
  year: number
  type: 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric'
  transmission: 'automatic' | 'manual'
  fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  seats: number
  price_per_day: number
  location: string
  latitude?: number
  longitude?: number
  images: string[]
  description: string
  features: string[]
  available: boolean
}): Promise<{ id: string | null; error: string | null }> {
  if (!isSupabaseConfigured()) {
    return { id: 'mock-' + Date.now(), error: null }
  }

  const { data, error } = await supabase
    .from('vehicles')
    .insert(vehicle)
    .select('id')
    .single()

  if (error) return { id: null, error: error.message }
  return { id: data?.id || null, error: null }
}

// Update vehicle
export async function updateVehicle(id: string, updates: Record<string, unknown>): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }

  const { error } = await supabase
    .from('vehicles')
    .update(updates)
    .eq('id', id)

  return { error: error?.message || null }
}

// Delete vehicle
export async function deleteVehicle(id: string): Promise<{ error: string | null }> {
  if (!isSupabaseConfigured()) return { error: null }

  const { error } = await supabase
    .from('vehicles')
    .delete()
    .eq('id', id)

  return { error: error?.message || null }
}

// Get reviews for a vehicle
export async function getVehicleReviews(vehicleId: string): Promise<Review[]> {
  if (!isSupabaseConfigured()) {
    return mockReviews.filter((r) => r.vehicleId === vehicleId)
  }

  const { data, error } = await supabase
    .from('reviews')
    .select('*, profiles!reviews_renter_id_fkey(name, avatar_url)')
    .eq('vehicle_id', vehicleId)
    .order('created_at', { ascending: false })

  if (error || !data) return []

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data.map((r: any) => ({
    id: r.id,
    vehicleId: r.vehicle_id,
    renterId: r.renter_id,
    renterName: r.profiles?.name || 'Unknown',
    renterAvatar: r.profiles?.avatar_url || undefined,
    rating: r.rating,
    comment: r.comment,
    createdAt: r.created_at,
  }))
}

// Helper to transform DB row to frontend Vehicle type
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toVehicle(row: any): Vehicle {
  return {
    id: row.id,
    ownerId: row.owner_id,
    ownerName: row.profiles?.name || 'Unknown',
    ownerAvatar: row.profiles?.avatar_url || undefined,
    title: row.title,
    brand: row.brand,
    model: row.model,
    year: row.year,
    type: row.type,
    transmission: row.transmission,
    fuelType: row.fuel_type,
    seats: row.seats,
    pricePerDay: Number(row.price_per_day),
    location: row.location,
    latitude: Number(row.latitude) || 6.9271,
    longitude: Number(row.longitude) || 79.8612,
    images: row.images,
    description: row.description,
    features: row.features,
    rating: Number(row.rating),
    totalTrips: row.total_trips,
    available: row.available,
    createdAt: row.created_at,
  }
}
