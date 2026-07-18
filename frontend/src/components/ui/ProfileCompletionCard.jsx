import { Link } from 'react-router-dom'
import { UserCheck, ChevronRight } from 'lucide-react'
import GovCard from './GovCard'

const PROFILE_FIELDS = [
  { key: 'name', label: 'Full Name' },
  { key: 'age', label: 'Age' },
  { key: 'gender', label: 'Gender' },
  { key: 'state', label: 'State' },
  { key: 'occupation', label: 'Occupation' },
  { key: 'category', label: 'Category' },
  { key: 'income', label: 'Income' },
]

export function calculateProfileCompletion(profile) {
  if (!profile) return { percent: 0, completed: 0, total: PROFILE_FIELDS.length }
  const completed = PROFILE_FIELDS.filter((f) => profile[f.key]).length
  return {
    percent: Math.round((completed / PROFILE_FIELDS.length) * 100),
    completed,
    total: PROFILE_FIELDS.length,
  }
}

export default function ProfileCompletionCard({ profile }) {
  const { percent, completed, total } = calculateProfileCompletion(profile)
  const isComplete = percent === 100

  return (
    <GovCard className="p-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0">
          <UserCheck size={22} className="text-primary-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 className="font-semibold text-gov-text">Profile Completion</h3>
            <span className={`text-sm font-bold ${isComplete ? 'text-gov-success' : 'text-primary-600'}`}>
              {percent}%
            </span>
          </div>
          <p className="text-sm text-gov-muted mb-4 leading-relaxed">
            {isComplete
              ? 'Your profile is complete. You will receive the most accurate scheme recommendations.'
              : 'Complete your profile to unlock personalized scheme recommendations based on your eligibility.'}
          </p>
          <div className="h-2.5 bg-gov-bg rounded-full overflow-hidden border border-gov-border mb-2">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isComplete ? 'bg-gov-success' : 'bg-primary-600'
              }`}
              style={{ width: `${percent}%` }}
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completion progress"
            />
          </div>
          <p className="text-xs text-gov-muted">
            {completed} of {total} fields completed
          </p>
        </div>
      </div>
      {!isComplete && (
        <Link
          to="/profile"
          className="mt-4 flex items-center justify-between gap-2 p-3 rounded-card bg-blue-50 border border-blue-100 text-primary-700 text-sm font-medium hover:bg-blue-100 transition-colors"
        >
          <span>Complete your profile for better matches</span>
          <ChevronRight size={16} />
        </Link>
      )}
    </GovCard>
  )
}
