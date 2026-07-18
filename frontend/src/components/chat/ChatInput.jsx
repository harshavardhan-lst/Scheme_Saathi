import { useState } from 'react'
import { Send } from 'lucide-react'

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim() || disabled) return
    onSend(text.trim())
    setText('')
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex gap-3 items-end py-4 border-t border-gov-border bg-gov-bg sticky bottom-0"
    >
      <label htmlFor="chat-input" className="sr-only">Type your question</label>
      <textarea
        id="chat-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask about government schemes, eligibility, or documents..."
        disabled={disabled}
        rows={1}
        className="form-input flex-1 resize-none overflow-hidden max-h-32 min-h-[48px]"
        style={{ height: 'auto' }}
        onInput={(e) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px' }}
      />
      <button
        type="submit"
        id="chat-send-btn"
        disabled={!text.trim() || disabled}
        className="btn-primary p-3 rounded-card shrink-0 min-h-[48px] min-w-[48px]"
        aria-label="Send message"
      >
        <Send size={18} />
      </button>
    </form>
  )
}
