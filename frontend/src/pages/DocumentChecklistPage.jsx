import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import PageWrapper from '../components/layout/PageWrapper'
import ChecklistItem from '../components/document/ChecklistItem'
import Spinner from '../components/ui/Spinner'
import ErrorBanner from '../components/ui/ErrorBanner'
import GovCard from '../components/ui/GovCard'
import { getChecklist, updateChecklistItem } from '../services/chat'
import { getSchemeById } from '../services/schemes'
import { ArrowLeft, ClipboardList } from 'lucide-react'

export default function DocumentChecklistPage() {
  const { schemeId } = useParams()
  const [items, setItems] = useState([])
  const [scheme, setScheme] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    Promise.all([
      getChecklist(schemeId),
      getSchemeById(schemeId),
    ])
      .then(([clRes, schRes]) => {
        setItems(clRes.data.items)
        setScheme(schRes.data)
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [schemeId])

  async function handleToggle(documentName, newStatus) {
    setUpdating(documentName)
    try {
      await updateChecklistItem(schemeId, documentName, newStatus)
      setItems((prev) =>
        prev.map((i) => (i.document_name === documentName ? { ...i, status: newStatus } : i))
      )
    } catch {}
    finally { setUpdating(null) }
  }

  const haveCount = items.filter((i) => i.status === 'have').length
  const progress = items.length > 0 ? Math.round((haveCount / items.length) * 100) : 0

  if (loading) return <PageWrapper><div className="flex justify-center py-20"><Spinner size="lg" /></div></PageWrapper>

  return (
    <PageWrapper>
      <div className="max-w-2xl mx-auto">
        <Link to={`/schemes/${schemeId}`} className="btn-ghost mb-6 -ml-2 text-sm inline-flex">
          <ArrowLeft size={16} /> Back to Scheme
        </Link>

        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center">
              <ClipboardList size={20} className="text-primary-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gov-text">Document Checklist</h1>
              {scheme && <p className="text-gov-muted text-sm mt-0.5">{scheme.scheme_name}</p>}
            </div>
          </div>
        </div>

        <ErrorBanner message={error} />

        {items.length > 0 && (
          <GovCard className="p-5 mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gov-text">{haveCount} of {items.length} documents ready</p>
              <p className="text-primary-600 font-bold text-sm">{progress}%</p>
            </div>
            <div className="h-2.5 bg-gov-bg rounded-full overflow-hidden border border-gov-border">
              <div
                className="h-full bg-primary-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
                role="progressbar"
                aria-valuenow={progress}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>
          </GovCard>
        )}

        <div className="space-y-2">
          {items.map((item) => (
            <ChecklistItem
              key={item.document_name}
              document_name={item.document_name}
              status={item.status}
              onToggle={handleToggle}
              disabled={updating === item.document_name}
            />
          ))}
        </div>

        {items.length === 0 && !error && (
          <GovCard className="p-8 text-center text-gov-muted text-sm">
            No documents listed for this scheme.
          </GovCard>
        )}
      </div>
    </PageWrapper>
  )
}
