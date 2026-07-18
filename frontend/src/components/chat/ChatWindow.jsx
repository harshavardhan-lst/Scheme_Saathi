import { useRef, useEffect } from 'react'
import ChatMessage from './ChatMessage'
import Spinner from '../ui/Spinner'
import Logo from '../ui/Logo'

export default function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) return null

  return (
    <div className="flex-1 overflow-y-auto py-4 space-y-4">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}
      {loading && (
        <div className="flex gap-3 items-start">
          <Logo size="sm" showText={false} />
          <div className="gov-card px-4 py-3">
            <Spinner size="sm" />
            <span className="sr-only">Assistant is typing</span>
          </div>
        </div>
      )}
      <div ref={bottomRef} />
    </div>
  )
}
