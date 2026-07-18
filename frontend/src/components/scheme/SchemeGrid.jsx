import SchemeCard from './SchemeCard'
import Spinner from '../ui/Spinner'

export default function SchemeGrid({ schemes, loading, emptyMessage = 'No schemes found.' }) {
  if (loading) return (
    <div className="flex justify-center py-20">
      <Spinner size="lg" />
    </div>
  )

  if (!schemes || schemes.length === 0) return (
    <div className="text-center py-16 text-gov-muted gov-card p-8">
      <p className="text-base">{emptyMessage}</p>
    </div>
  )

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {schemes.map((s) => (
        <SchemeCard
          key={s.scheme_id || s.id}
          scheme={s}
          score={s.score}
          explanation={s.explanation}
        />
      ))}
    </div>
  )
}
