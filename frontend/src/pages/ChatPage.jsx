import { useState } from 'react'
import ChatWindow from '../components/chat/ChatWindow'
import ChatInput from '../components/chat/ChatInput'
import { sendMessage } from '../services/chat'
import Logo from '../components/ui/Logo'
import GovCard from '../components/ui/GovCard'
import { Shield, HelpCircle } from 'lucide-react'

const suggestedQuestions = [
  'What schemes are available for farmers?',
  'Am I eligible for PM-KISAN?',
  'Scholarships for students in Telangana',
  'Housing schemes for low-income families',
]

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  async function handleSend(text) {
    const userMsg = { role: 'user', content: text, timestamp: new Date() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)
    try {
      const res = await sendMessage(text)
      const { answer, scheme_refs } = res.data
      const aiMsg = { role: 'ai', content: answer, scheme_refs, timestamp: new Date() }
      setMessages((prev) => [...prev, aiMsg])
    } catch (err) {
      const errMsg = {
        role: 'ai',
        content: `${err.message || 'Service is currently unavailable. Please try again.'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errMsg])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)] bg-gov-bg">
      <div className="bg-white border-b border-gov-border px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center gap-4">
          <Logo size="sm" showText={false} />
          <div className="flex-1">
            <p className="font-semibold text-gov-text text-sm">SchemeSathi Digital Assistant</p>
            <p className="text-gov-muted text-xs">Official government scheme guidance in plain language</p>
          </div>
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 border border-green-100">
            <div className="w-2 h-2 rounded-full bg-gov-success" />
            <span className="text-gov-success text-xs font-medium">Available</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden max-w-3xl w-full mx-auto flex flex-col px-4">
        {messages.length === 0 && !loading && (
          <div className="py-8 space-y-6 animate-fade-in">
            <GovCard className="p-6 text-center">
              <div className="w-14 h-14 rounded-card bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={28} className="text-primary-600" />
              </div>
              <h2 className="font-semibold text-gov-text mb-2">How can we help you today?</h2>
              <p className="text-sm text-gov-muted mb-4 leading-relaxed">
                Ask about government schemes, eligibility criteria, required documents, or application processes.
              </p>
              <div className="flex items-center justify-center gap-2 text-xs text-gov-muted">
                <Shield size={14} className="text-gov-success" />
                <span>Responses based on verified government scheme data</span>
              </div>
            </GovCard>

            <div>
              <p className="text-xs font-medium text-gov-muted mb-3 uppercase tracking-wide">Suggested Questions</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSend(q)}
                    className="text-left p-3 rounded-card bg-white border border-gov-border text-sm text-gov-text hover:border-primary-300 hover:bg-blue-50 transition-colors min-h-[48px]"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <ChatWindow messages={messages} loading={loading} />
        <ChatInput onSend={handleSend} disabled={loading} />
      </div>
    </div>
  )
}
