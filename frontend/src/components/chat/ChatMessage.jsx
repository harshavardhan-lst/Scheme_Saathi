import { Link } from 'react-router-dom'
import Logo from '../ui/Logo'

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'

  return (
    <div className={`flex gap-3 items-start ${isUser ? 'flex-row-reverse' : ''} animate-slide-up`}>
      {!isUser ? (
        <Logo size="sm" showText={false} className="shrink-0" />
      ) : (
        <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-semibold shrink-0">
          You
        </div>
      )}

      <div className={`max-w-[80%] rounded-card px-4 py-3 text-sm leading-relaxed ${
        isUser
          ? 'bg-primary-600 text-white'
          : 'gov-card text-gov-text'
      }`}>
        <p className="whitespace-pre-wrap">{message.content}</p>

        {message.scheme_refs && message.scheme_refs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {message.scheme_refs.map((id) => (
              <Link
                key={id}
                to={`/schemes/${id}`}
                className="text-xs text-primary-600 hover:text-primary-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full transition-colors font-medium"
              >
                View Scheme →
              </Link>
            ))}
          </div>
        )}

        <p className={`text-xs mt-2 ${isUser ? 'text-blue-100' : 'text-gov-muted'}`}>
          {new Date(message.timestamp || Date.now()).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  )
}
