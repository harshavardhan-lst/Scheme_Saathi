import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../context/LanguageContext'
import PageWrapper from '../components/layout/PageWrapper'
import ErrorBanner from '../components/ui/ErrorBanner'
import Spinner from '../components/ui/Spinner'
import GovCard from '../components/ui/GovCard'
import { getSchemeById } from '../services/schemes'
import { checkEligibility, explainScheme } from '../services/chat'
import {
  ExternalLink, Calendar, FileText, BookOpen, CheckCircle, XCircle, ClipboardList, ArrowLeft
} from 'lucide-react'

export default function SchemeDetailPage() {
  const { id } = useParams()
  const { isAuthenticated } = useAuth()
  const { language } = useLanguage()
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [eligibility, setEligibility] = useState(null)
  const [simplified, setSimplified] = useState(null)
  const [simplifyLoading, setSimplifyLoading] = useState(false)

  useEffect(() => {
    setLoading(true)
    getSchemeById(id)
      .then((r) => setScheme(r.data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => {
    if (isAuthenticated && id) {
      checkEligibility(id).then((r) => setEligibility(r.data)).catch(() => {})
    }
  }, [id, isAuthenticated])

  function handleSimplify() {
    setSimplifyLoading(true)
    explainScheme(id, language)
      .then((r) => setSimplified(r.data))
      .catch(() => {})
      .finally(() => setSimplifyLoading(false))
  }

  if (loading) return <PageWrapper><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageWrapper>
  if (error) return <PageWrapper><ErrorBanner message={error} /></PageWrapper>
  if (!scheme) return null

  const deadline = scheme.deadline ? new Date(scheme.deadline) : null
  const docs = Array.isArray(scheme.documents) ? scheme.documents : []

  return (
    <PageWrapper>
      <div className="max-w-3xl mx-auto">
        <Link to="/search" className="btn-ghost mb-6 -ml-2 text-sm inline-flex">
          <ArrowLeft size={16} /> Back to Search
        </Link>

        <div className="mb-6">
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="badge-blue">{scheme.state}</span>
            {deadline ? (
              <span className="badge-orange flex items-center gap-1">
                <Calendar size={12} /> Deadline: {deadline.toLocaleDateString('en-IN')}
              </span>
            ) : (
              <span className="badge-green">Open-ended</span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gov-text mb-3">{scheme.scheme_name}</h1>
          <p className="text-gov-muted leading-relaxed">{scheme.description}</p>
        </div>

        {eligibility && (
          <GovCard className={`p-5 mb-6 flex items-start gap-3 ${
            eligibility.eligible ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
          }`}>
            {eligibility.eligible
              ? <CheckCircle size={22} className="text-gov-success shrink-0 mt-0.5" />
              : <XCircle size={22} className="text-gov-danger shrink-0 mt-0.5" />}
            <div>
              <p className={`font-semibold text-sm ${eligibility.eligible ? 'text-gov-success' : 'text-gov-danger'}`}>
                {eligibility.eligible ? 'You appear eligible for this scheme' : 'You may not meet all criteria'}
              </p>
              <p className="text-gov-muted text-sm mt-1">{eligibility.explanation}</p>
            </div>
          </GovCard>
        )}

        <div className="space-y-4">
          <GovCard className="p-5">
            <h2 className="font-semibold text-gov-text mb-3 flex items-center gap-2 text-sm">
              <BookOpen size={16} className="text-primary-600" /> Benefits
            </h2>
            <p className="text-gov-muted text-sm leading-relaxed">{scheme.benefits}</p>
          </GovCard>

          <GovCard className="p-5">
            <div className="flex items-center justify-between mb-3 gap-4">
              <h2 className="font-semibold text-gov-text flex items-center gap-2 text-sm">
                <FileText size={16} className="text-primary-600" /> Plain Language Explanation
              </h2>
              {!simplified && (
                <button onClick={handleSimplify} disabled={simplifyLoading} className="btn-primary py-1.5 px-4 text-xs shrink-0">
                  {simplifyLoading ? <Spinner size="sm" /> : 'Get Summary'}
                </button>
              )}
            </div>
            {simplified ? (
              <p className="text-gov-muted text-sm leading-relaxed">{simplified.simplified_eligibility}</p>
            ) : (
              <p className="text-gov-muted text-sm">Click the button to get a simplified explanation in plain language.</p>
            )}
          </GovCard>

          <GovCard className="p-5">
            <h2 className="font-semibold text-gov-text mb-3 flex items-center gap-2 text-sm">
              <FileText size={16} className="text-primary-600" /> Required Documents
            </h2>
            {docs.length > 0 ? (
              <ul className="space-y-2">
                {docs.map((doc) => (
                  <li key={doc} className="flex items-center gap-2 text-sm text-gov-muted">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary-600 shrink-0" />
                    {doc}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gov-muted text-sm">No specific documents listed.</p>
            )}

            {isAuthenticated && (
              <Link to={`/documents/${id}`} className="btn-secondary mt-4 text-sm py-2 inline-flex gap-2 min-h-[40px]">
                <ClipboardList size={16} /> Track My Documents
              </Link>
            )}
          </GovCard>

          {scheme.application_link && (
            <a href={scheme.application_link} target="_blank" rel="noopener noreferrer"
              className="btn-primary w-full justify-center py-3 min-h-[48px]">
              Apply at Official Portal <ExternalLink size={16} />
            </a>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
