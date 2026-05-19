import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Car, Upload, Check, Loader2, MapPin } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { createVehicle } from '@/lib/vehicles'
import { uploadVehicleImages } from '@/lib/storage'
import { toast } from 'sonner'

export default function ListVehicle() {
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [files, setFiles] = useState<File[]>([])

  // Form state
  const [brand, setBrand] = useState('')
  const [model, setModel] = useState('')
  const [year, setYear] = useState('')
  const [type, setType] = useState('')
  const [transmission, setTransmission] = useState('automatic')
  const [fuelType, setFuelType] = useState('petrol')
  const [seats, setSeats] = useState('5')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [pricePerDay, setPricePerDay] = useState('')
  const [location, setLocation] = useState('')
  const [latitude, setLatitude] = useState('')
  const [longitude, setLongitude] = useState('')
  const [detectingLocation, setDetectingLocation] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser')
      return
    }
    setDetectingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude.toFixed(6))
        setLongitude(position.coords.longitude.toFixed(6))
        setDetectingLocation(false)
        toast.success('Location detected!')
      },
      () => {
        toast.error('Unable to detect location. Please enter manually.')
        setDetectingLocation(false)
      }
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated || !user) {
      toast.error('Please log in to list a vehicle')
      navigate('/login')
      return
    }

    setLoading(true)

    // Upload images
    const { urls, error: uploadError } = await uploadVehicleImages(user.id, files)
    if (uploadError) {
      toast.error(uploadError)
      setLoading(false)
      return
    }

    // Create vehicle
    const { error } = await createVehicle({
      owner_id: user.id,
      title,
      brand,
      model,
      year: parseInt(year),
      type: type as 'sedan' | 'suv' | 'hatchback' | 'van' | 'truck' | 'luxury' | 'electric',
      transmission: transmission as 'automatic' | 'manual',
      fuel_type: fuelType as 'petrol' | 'diesel' | 'electric' | 'hybrid',
      seats: parseInt(seats),
      price_per_day: parseFloat(pricePerDay),
      location,
      latitude: latitude ? parseFloat(latitude) : 6.9271,
      longitude: longitude ? parseFloat(longitude) : 79.8612,
      images: urls,
      description,
      features: [],
      available: true,
    })

    if (error) {
      toast.error(error)
      setLoading(false)
      return
    }

    toast.success('Vehicle listed successfully!')
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <div className="h-16 w-16 bg-primary-light rounded-full flex items-center justify-center mx-auto">
          <Check className="h-8 w-8 text-primary-dark" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground">Vehicle Listed!</h2>
        <p className="mt-2 text-muted-foreground">Your vehicle is now visible to renters. You'll receive notifications when someone books.</p>
        <div className="mt-6 flex gap-3 justify-center">
          <Link to="/owner/dashboard">
            <Button>Go to Dashboard</Button>
          </Link>
          <Button variant="outline" onClick={() => setSubmitted(false)}>List Another</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">List Your Vehicle</h1>
        <p className="mt-1 text-muted-foreground">Start earning by sharing your vehicle with verified renters.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <fieldset className="space-y-4 border border-border rounded-lg p-5">
          <legend className="text-sm font-semibold text-foreground px-2">Vehicle Details</legend>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Brand</label>
              <input required value={brand} onChange={(e) => setBrand(e.target.value)} placeholder="e.g. Toyota" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Model</label>
              <input required value={model} onChange={(e) => setModel(e.target.value)} placeholder="e.g. Prius" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Year</label>
              <input required type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="2023" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Vehicle Type</label>
              <select required value={type} onChange={(e) => setType(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="">Select type...</option>
                <option value="sedan">Sedan</option>
                <option value="suv">SUV</option>
                <option value="hatchback">Hatchback</option>
                <option value="van">Van</option>
                <option value="truck">Truck</option>
                <option value="luxury">Luxury</option>
                <option value="electric">Electric</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Transmission</label>
              <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Fuel Type</label>
              <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50">
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Seats</label>
              <input required type="number" min="2" max="15" value={seats} onChange={(e) => setSeats(e.target.value)} className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </fieldset>

        <fieldset className="space-y-4 border border-border rounded-lg p-5">
          <legend className="text-sm font-semibold text-foreground px-2">Listing Info</legend>
          <div>
            <label className="text-xs font-medium text-foreground">Title</label>
            <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Toyota Prius 2022 - Fuel Efficient" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe your vehicle..." className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground">Price per Day ($)</label>
              <input required type="number" min="1" value={pricePerDay} onChange={(e) => setPricePerDay(e.target.value)} placeholder="45" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground">Location</label>
              <input required value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g. Colombo 07" className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
          {/* GPS Coordinates */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-medium text-foreground">GPS Coordinates</label>
              <button
                type="button"
                onClick={detectLocation}
                disabled={detectingLocation}
                className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
              >
                <MapPin className="h-3 w-3" />
                {detectingLocation ? 'Detecting...' : 'Detect My Location'}
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="Latitude (e.g. 6.9271)"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="Longitude (e.g. 79.8612)"
                className="w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground">Used to show your vehicle on the map. Click "Detect My Location" or enter manually.</p>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Photos</label>
            <label className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer block">
              <Upload className="h-8 w-8 text-muted-foreground mx-auto" />
              <p className="mt-2 text-sm text-muted-foreground">
                {files.length > 0 ? `${files.length} file(s) selected` : 'Click to upload photos'}
              </p>
              <p className="text-xs text-muted-foreground">PNG, JPG up to 5MB each</p>
              <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
            </label>
          </div>
        </fieldset>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Car className="h-4 w-4 mr-2" />}
          Publish Listing
        </Button>
      </form>
    </div>
  )
}
