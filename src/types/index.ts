export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'owner' | 'renter'
  phone?: string
  joinedAt: string
  rating: number
  totalTrips: number
}

export interface Vehicle {
  id: string
  ownerId: string
  ownerName: string
  ownerAvatar?: string
  title: string
  brand: string
  model: string
  year: number
  type: 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric'
  transmission: 'automatic' | 'manual'
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid'
  seats: number
  pricePerDay: number
  location: string
  latitude: number
  longitude: number
  images: string[]
  description: string
  features: string[]
  rating: number
  totalTrips: number
  available: boolean
  createdAt: string
}

export interface Booking {
  id: string
  vehicleId: string
  vehicleTitle: string
  vehicleImage: string
  renterId: string
  renterName: string
  ownerId: string
  ownerName: string
  startDate: string
  endDate: string
  totalPrice: number
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
  createdAt: string
}

export interface Review {
  id: string
  vehicleId: string
  renterId: string
  renterName: string
  renterAvatar?: string
  rating: number
  comment: string
  createdAt: string
}
