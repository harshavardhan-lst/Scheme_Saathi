import { AlertTriangle } from 'lucide-react'

export default function ErrorBanner({ message, onRetry }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 p-4 rounded-card bg-red-50 border border-red-200 text-gov-danger animate-fade-in" role="alert">
      <AlertTriangle size={18} className="mt-0.5 shrink-0" />
      <div className="flex-1 text-sm">{message}</div>
      {onRetry && (
        <button onClick={onRetry} className="text-xs underline hover:no-underline shrink-0 font-medium">
          Retry
        </button>
      )}
    </div>
  )
}
