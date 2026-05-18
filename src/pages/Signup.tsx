import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Car, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'

export default function Signup() {
  const [role, setRole] = useState<'renter' | 'owner'>('renter')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await signUp(email, password, { name, phone, role })

    if (error) {
      toast.error(error)
      setLoading(false)
      return
    }

    toast.success('Account created! Check your email to verify.')
    navigate('/login')
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-foreground">rento</span>
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-foreground">Create your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Join Rento and start renting smarter</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Toggle */}
          <div>
            <label className="text-xs font-medium text-foreground">I want to</label>
            <div className="mt-1 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole('renter')}
                className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'renter'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary'
                }`}
              >
                Rent a Vehicle
              </button>
              <button
                type="button"
                onClick={() => setRole('owner')}
                className={`h-10 rounded-lg border text-sm font-medium transition-colors ${
                  role === 'owner'
                    ? 'bg-primary text-white border-primary'
                    : 'bg-background text-muted-foreground border-border hover:border-primary'
                }`}
              >
                List My Vehicle
              </button>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+94 77 123 4567"
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              minLength={8}
              className="mt-1 w-full h-10 px-3 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Create Account
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-medium hover:underline">Log in</Link>
        </p>
      </div>
    </div>
  )
}
