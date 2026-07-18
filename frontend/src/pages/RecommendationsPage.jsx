import { useEffect, useState } from 'react'
import PageWrapper from '../components/layout/PageWrapper'
import SchemeGrid from '../components/scheme/SchemeGrid'
import ErrorBanner from '../components/ui/ErrorBanner'
import { getRecommendations } from '../services/recommend'
import { Link } from 'react-router-dom'
import { Star, RefreshCw } from 'lucide-react'

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  function fetchRecs() {
    setLoading(true)
    setError('')
    getRecommendations()
      .then((res) => setRecommendations(res.data.recommendations || []))
      .catch((err) => {
        if (err.code === 'INCOMPLETE_PROFILE') {
          setError('Your profile is incomplete. Please complete it to get recommendations.')
        } else {
          setError(err.message || 'Failed to load recommendations')
        }
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchRecs() }, [])

  const incompleteProfile = error && error.includes('incomplete')

  return (
    <PageWrapper>
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-card bg-amber-50 border border-amber-100 flex items-center justify-center">
            <Star size={20} className="text-gov-warning" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gov-text">Saved & Recommended Schemes</h1>
            <p className="text-gov-muted text-sm">
              {recommendations.length > 0
                ? `${recommendations.length} scheme${recommendations.length !== 1 ? 's' : ''} matched to your profile`
                : 'Schemes matched to your profile will appear here'}
            </p>
          </div>
        </div>
        <button onClick={fetchRecs} className="btn-secondary p-2.5 min-h-[44px] min-w-[44px]" title="Refresh" aria-label="Refresh recommendations">
          <RefreshCw size={18} />
        </button>
      </div>

      <ErrorBanner message={error} />

      {incompleteProfile && (
        <div className="mt-4">
          <Link to="/profile" className="btn-primary min-h-[44px]">Complete Your Profile →</Link>
        </div>
      )}

      {!error && (
        <SchemeGrid
          schemes={recommendations.map((r) => ({
            ...r,
            id: r.scheme_id,
            scheme_id: r.scheme_id,
            description: r.explanation,
          }))}
          loading={loading}
          emptyMessage="No schemes matched your profile. Try updating your profile details."
        />
      )}
    </PageWrapper>
  )
}
