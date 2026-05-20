import { Link } from 'react-router-dom'
import { Car, Plus, User } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

export function AppHeader() {
  const { isAuthenticated, profile, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    toast.success('Signed out')
    navigate('/')
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-navy shadow-lg">
      <div className="flex h-14 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <Car className="h-5 w-5 text-primary" />
          <span className="text-lg font-bold tracking-tight text-white">rento</span>
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <Link
                to="/list-vehicle"
                className="h-8 w-8 rounded-full bg-primary flex items-center justify-center"
              >
                <Plus className="h-4 w-4 text-navy" />
              </Link>
              <button
                onClick={handleSignOut}
                className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center"
              >
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="h-8 w-8 rounded-full object-cover" />
                ) : (
                  <User className="h-4 w-4 text-white" />
                )}
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="text-xs font-medium text-white bg-white/10 px-3 py-1.5 rounded-full hover:bg-white/20 transition-colors"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
