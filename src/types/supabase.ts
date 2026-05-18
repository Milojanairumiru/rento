export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          avatar_url: string | null
          phone: string | null
          role: 'owner' | 'renter'
          rating: number
          total_trips: number
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'owner' | 'renter'
          rating?: number
          total_trips?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          avatar_url?: string | null
          phone?: string | null
          role?: 'owner' | 'renter'
          rating?: number
          total_trips?: number
          created_at?: string
        }
      }
      vehicles: {
        Row: {
          id: string
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
          images: string[]
          description: string
          features: string[]
          rating: number
          total_trips: number
          available: boolean
          created_at: string
        }
        Insert: {
          id?: string
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
          images?: string[]
          description: string
          features?: string[]
          rating?: number
          total_trips?: number
          available?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          title?: string
          brand?: string
          model?: string
          year?: number
          type?: 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric'
          transmission?: 'automatic' | 'manual'
          fuel_type?: 'petrol' | 'diesel' | 'electric' | 'hybrid'
          seats?: number
          price_per_day?: number
          location?: string
          images?: string[]
          description?: string
          features?: string[]
          rating?: number
          total_trips?: number
          available?: boolean
          created_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          vehicle_id: string
          renter_id: string
          owner_id: string
          start_date: string
          end_date: string
          total_price: number
          status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          renter_id: string
          owner_id: string
          start_date: string
          end_date: string
          total_price: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          renter_id?: string
          owner_id?: string
          start_date?: string
          end_date?: string
          total_price?: number
          status?: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          vehicle_id: string
          renter_id: string
          rating: number
          comment: string
          created_at: string
        }
        Insert: {
          id?: string
          vehicle_id: string
          renter_id: string
          rating: number
          comment: string
          created_at?: string
        }
        Update: {
          id?: string
          vehicle_id?: string
          renter_id?: string
          rating?: number
          comment?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'owner' | 'renter'
      vehicle_type: 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric'
      transmission_type: 'automatic' | 'manual'
      fuel_type: 'petrol' | 'diesel' | 'electric' | 'hybrid'
      booking_status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled'
    }
  }
}
