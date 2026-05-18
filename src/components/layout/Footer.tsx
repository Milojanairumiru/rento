import { Link } from 'react-router-dom'
import { Car } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <Car className="h-5 w-5 text-primary" />
              <span className="text-lg font-bold text-foreground">rento</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground">
              Your Rental Partner. Rent smarter with peer-to-peer vehicle sharing.
            </p>
          </div>

          {/* For Renters */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">For Renters</h4>
            <ul className="space-y-2">
              <li><Link to="/browse" className="text-sm text-muted-foreground hover:text-primary transition-colors">Browse Vehicles</Link></li>
              <li><Link to="/renter/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">My Trips</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">How It Works</Link></li>
            </ul>
          </div>

          {/* For Owners */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">For Owners</h4>
            <ul className="space-y-2">
              <li><Link to="/list-vehicle" className="text-sm text-muted-foreground hover:text-primary transition-colors">List Your Vehicle</Link></li>
              <li><Link to="/owner/dashboard" className="text-sm text-muted-foreground hover:text-primary transition-colors">Owner Dashboard</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Pricing</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Company</h4>
            <ul className="space-y-2">
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-sm text-muted-foreground">&copy; 2025 Rento. All rights reserved.</p>
          <p className="text-sm text-muted-foreground">Move Easy.</p>
        </div>
      </div>
    </footer>
  )
}
