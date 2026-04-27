import { useState } from 'react'

// ── Badge ───────────────────────────────────────────────────────────────────
const statusMap = {
  pendente: 'badge-yellow',
  aceito: 'badge-green',
  recusado: 'badge-red',
  confirmado: 'badge-green',
  cancelado: 'badge-red',
  aberto: 'badge-blue',
  'em andamento': 'badge-blue',
  concluido: 'badge-green',
}

export function StatusBadge({ status }) {
  const s = status?.toLowerCase() || 'pendente'
  return (
    <span className={`badge ${statusMap[s] || 'badge-gray'}`}>
      {status || 'pendente'}
    </span>
  )
}

// ── Spinner ─────────────────────────────────────────────────────────────────
export function Spinner() {
  return <span className="spinner" />
}

// ── Modal ───────────────────────────────────────────────────────────────────
export function Modal({ title, onClose, children, footer }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">{title}</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ── TagInput ─────────────────────────────────────────────────────────────────
export function TagInput({ value = [], onChange, placeholder }) {
  const [inp, setInp] = useState('')

  function add() {
    const v = inp.trim()
    if (v && !value.includes(v)) onChange([...value, v])
    setInp('')
  }

  function remove(tag) {
    onChange(value.filter((x) => x !== tag))
  }

  return (
    <div className="tag-input-wrap">
      {value.map((t) => (
        <span key={t} className="tag">
          {t}
          <button className="tag-remove" onClick={() => remove(t)}>×</button>
        </span>
      ))}
      <input
        value={inp}
        onChange={(e) => setInp(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add() }
          if (e.key === 'Backspace' && !inp && value.length) {
            onChange(value.slice(0, -1))
          }
        }}
        placeholder={placeholder || 'Digite e pressione Enter...'}
      />
    </div>
  )
}

// ── Empty state ──────────────────────────────────────────────────────────────
export function Empty({ icon = '📭', message = 'Nenhum item encontrado.' }) {
  return (
    <div className="empty">
      <div className="empty-icon">{icon}</div>
      <p>{message}</p>
    </div>
  )
}

// ── Loading text ─────────────────────────────────────────────────────────────
export function Loading({ text = 'Carregando...' }) {
  return <p style={{ color: '#999', fontSize: 14, padding: '24px 0' }}>{text}</p>
}
