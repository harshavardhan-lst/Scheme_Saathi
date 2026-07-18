import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center text-center px-4 bg-gov-bg">
      <div className="animate-fade-in max-w-md">
        <div className="w-16 h-16 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-6">
          <Search size={32} className="text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-gov-text mb-3">Page Not Found</h1>
        <p className="text-gov-muted mb-8">The page you're looking for doesn't exist or has been moved.</p>
        <Link to="/" className="btn-primary min-h-[48px]">Go to Home</Link>
      </div>
    </div>
  )
}
