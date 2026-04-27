import { useState, useEffect, useRef } from 'react'
import { useToast } from '../contexts/ToastContext'
import { createSession, sendChat } from '../services/api'
import { Spinner } from '../components/UI'
import ReactMarkdown from "react-markdown";

export default function ChatPage() {
  const toast = useToast()
  const [sessionId, setSessionId] = useState(null)
  const [msgs, setMsgs] = useState([])
  const [inp, setInp] = useState('')
  const [loading, setLoading] = useState(false)
  const [starting, setStarting] = useState(true)
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  async function startSession() {
    try {
      const r = await createSession()
      setSessionId(r.session_id)
    } catch {
      toast('Erro ao iniciar sessão de chat', 'error')
    }
    setStarting(false)
  }

  async function clearChat() {
    setMsgs([])
    setInp('')
    setSessionId(null)
    setStarting(true)
    await startSession()
    inputRef.current?.focus()
  }

  useEffect(() => { startSession() }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  async function send() {
    const text = inp.trim()
    if (!text || !sessionId || loading) return
    setInp('')
    setMsgs((m) => [...m, { role: 'user', text }])
    setLoading(true)

    try {
      const r = await sendChat(sessionId, text)
      setMsgs((m) => [...m, { role: 'bot', text: r.response || 'Sem resposta.' }])
    } catch {
      setMsgs((m) => [...m, { role: 'bot', text: '⚠️ Erro ao obter resposta. Tente novamente.' }])
    }
    setLoading(false)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  if (starting) {
    return (
      <div className="page">
        <p style={{ color: '#999', fontSize: 14 }}>Iniciando sessão de chat com a IA...</p>
      </div>
    )
  }

  if (!sessionId) {
    return (
      <div className="page">
        <p style={{ color: '#dc2626', fontSize: 14 }}>Não foi possível iniciar a sessão. Recarregue a página.</p>
      </div>
    )
  }

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 80px)', padding: '16px 16px 0' }}>
      <h1 className="page-title" style={{ marginBottom: 12 }}>Chat com IA</h1>
      <button
        onClick={clearChat}
        className="btn-secondary"
        style={{ fontSize: 13 }}
      >
        Limpar chat
    </button>
      {/* Messages */}
      <div className="chat-messages" style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
        {msgs.length === 0 && (
          <div style={{
            margin: 'auto', textAlign: 'center', color: '#999',
            fontSize: 14, padding: 24,
          }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
            Olá! Sou a Koinonia_AI.<br />
            Como posso ajudar sua instituição hoje?
          </div>
        )}
        {msgs.map((m, i) => (
          <div key={i} className={`chat-msg ${m.role}`}>
            <ReactMarkdown>{m.text}</ReactMarkdown>
          </div>
        ))}
        {loading && (
          <div className="chat-msg bot" style={{ opacity: 0.6 }}>
            Digitando...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="chat-input-row" style={{ padding: '12px 0 16px' }}>
        <input
          ref={inputRef}
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Digite sua mensagem..."
          disabled={loading}
          autoFocus
        />
        <button
          className="btn-primary"
          onClick={send}
          disabled={loading || !inp.trim()}
          style={{ minWidth: 80 }}
        >
          {loading ? <Spinner /> : 'Enviar'}
        </button>
      </div>
    </div>
  )
}
