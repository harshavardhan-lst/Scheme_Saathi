import { CheckCircle, Circle } from 'lucide-react'
import GovCard from '../ui/GovCard'

export default function ChecklistItem({ document_name, status, onToggle, disabled }) {
  const isHave = status === 'have'

  return (
    <GovCard className={`p-4 flex items-center gap-3 transition-colors ${
      isHave ? 'border-green-200 bg-green-50' : ''
    }`}>
      <button
        onClick={() => onToggle(document_name, isHave ? 'missing' : 'have')}
        disabled={disabled}
        className="shrink-0 hover:opacity-80 transition-opacity disabled:opacity-50 min-h-[44px] min-w-[44px] flex items-center justify-center"
        aria-label={isHave ? `Mark ${document_name} as missing` : `Mark ${document_name} as ready`}
      >
        {isHave
          ? <CheckCircle size={22} className="text-gov-success" />
          : <Circle size={22} className="text-gov-muted" />
        }
      </button>
      <span className="text-sm text-gov-text flex-1">{document_name}</span>
      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
        isHave ? 'bg-green-100 text-gov-success' : 'bg-gov-bg text-gov-muted border border-gov-border'
      }`}>
        {isHave ? 'Ready' : 'Missing'}
      </span>
    </GovCard>
  )
}
