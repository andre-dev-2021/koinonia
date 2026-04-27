import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { getCollection, updateConviteStatus } from '../services/api'
import { StatusBadge, Empty, Loading } from '../components/UI'

export default function MeusConvitesPage() {
  const { user } = useAuth()
  const toast = useToast()
  const [convites, setConvites] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  async function load() {
    setLoading(true)
    try {
      const r = await getCollection('convites')
      const docs = r?.documents || r?.docs || (Array.isArray(r) ? r : Object.values(r || {}))
      const all = Array.isArray(docs) ? docs : []
      console.log(docs)
      const meus = all.filter((c) => 
        c.uid_voluntario === user?.id || 
        c.email_voluntario === user?.email
      )
      setConvites(meus)
    } catch {
      setConvites([])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function changeStatus(id, status) {
    setUpdating(id + status)
    try {
      await updateConviteStatus(id, status)
      toast(`Convite ${status}!`, 'success')
      load()
    } catch (e) {
      toast(e.message || 'Erro ao atualizar status', 'error')
    }
    setUpdating(null)
  }

  function formatDate(s) {
    if (!s) return '—'
    try { return new Date(s).toLocaleString('pt-BR') } catch { return s }
  }

  const pendentes = convites.filter((c) => !c.status || c.status === 'pendente')
  const outros = convites.filter((c) => c.status && c.status !== 'pendente')

  return (
    <div className="page">
      <h1 className="page-title">Meus Convites</h1>

      {loading ? (
        <Loading />
      ) : convites.length === 0 ? (
        <Empty icon="✉️" message="Você não tem convites no momento." />
      ) : (
        <>
          {pendentes.length > 0 && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Aguardando resposta
              </h2>
              {pendentes.map((c, i) => (
                <div key={c.id || c.doc_id || i} className="card event-card">
                  <div className="event-inner">
                    <div style={{ flex: 1 }}>
                      <div className="event-title">{c.titulo_evento || '—'}</div>
                      <div className="event-meta">
                        <span>🏢 {c.nome_instituicao}</span>
                        <span>📅 {formatDate(c.horario_evento)}</span>
                      </div>
                      <StatusBadge status="pendente" />
                    </div>
                    <div className="event-actions">
                      <button
                        className="btn-primary btn-sm"
                        onClick={() => changeStatus(c.id, 'aceito')}
                        disabled={!!updating}
                      >
                        Aceitar
                      </button>
                      <button
                        className="btn-danger btn-sm"
                        onClick={() => changeStatus(c.id, 'recusado')}
                        disabled={!!updating}
                      >
                        Recusar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}

          {outros.length > 0 && (
            <>
              <h2 style={{ fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 10, marginTop: 24, textTransform: 'uppercase', letterSpacing: '.5px' }}>
                Respondidos
              </h2>
              {outros.map((c, i) => (
                <div key={c.id || c.doc_id || i} className="card event-card">
                  <div className="event-title">{c.titulo_evento || '—'}</div>
                  <div className="event-meta">
                    <span>🏢 {c.nome_instituicao}</span>
                    <span>📅 {formatDate(c.horario_evento)}</span>
                  </div>
                  <StatusBadge status={c.status} />
                </div>
              ))}
            </>
          )}
        </>
      )}
    </div>
  )
}
