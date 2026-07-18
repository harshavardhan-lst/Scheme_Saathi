import { MapPin, Calendar, ArrowRight, TrendingUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import GovCard from '../ui/GovCard'

export default function SchemeCard({ scheme, score, explanation }) {
  const deadline = scheme.deadline ? new Date(scheme.deadline) : null
  const isUrgent = deadline && (deadline - Date.now()) < 30 * 24 * 60 * 60 * 1000

  return (
    <GovCard interactive className="p-5 flex flex-col gap-3 animate-slide-up">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-gov-text leading-snug line-clamp-2 text-sm">
          {scheme.scheme_name}
        </h3>
        {score !== undefined && (
          <div className="shrink-0 flex items-center gap-1 bg-blue-50 text-primary-700 text-xs font-bold px-2 py-1 rounded-card border border-blue-100">
            <TrendingUp size={11} />
            {Math.round(score * 100)}%
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 text-xs text-gov-muted flex-wrap">
        <span className="flex items-center gap-1">
          <MapPin size={11} />
          {scheme.state}
        </span>
        {deadline ? (
          <span className={`flex items-center gap-1 ${isUrgent ? 'text-gov-warning' : ''}`}>
            <Calendar size={11} />
            Deadline: {deadline.toLocaleDateString('en-IN')}
          </span>
        ) : (
          <span className="text-gov-success">Open-ended</span>
        )}
      </div>

      <p className="text-gov-muted text-xs leading-relaxed line-clamp-2">
        {scheme.description || scheme.benefits}
      </p>

      {explanation && (
        <p className="text-primary-600 text-xs italic line-clamp-2 bg-blue-50 p-2 rounded-card">
          {explanation}
        </p>
      )}

      <Link
        to={`/schemes/${scheme.scheme_id || scheme.id}`}
        className="mt-auto flex items-center gap-1 text-primary-600 hover:text-primary-700 text-xs font-semibold transition-colors group min-h-[32px]"
      >
        View Details <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </GovCard>
  )
}
