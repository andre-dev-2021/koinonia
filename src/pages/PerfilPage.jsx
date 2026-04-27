import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { TagInput, Spinner } from '../components/UI'
import {
  createVoluntario,
  updateVoluntario,
  createInstituicao,
  updateInstituicao,
  buscarIdInstituicaoPorNome,
  buscarIdVoluntarioPorNome
} from '../services/api'

const INST_FIELDS = [
  { key: 'nome', label: 'Nome da Instituição', full: true },
  { key: 'setor', label: 'Setor', full: true },
  { key: 'logradouro', label: 'Logradouro', full: true },
  { key: 'numero', label: 'Número', type: 'number' },
  { key: 'cidade', label: 'Cidade' },
  { key: 'uf', label: 'UF' },
  { key: 'cep', label: 'CEP' },
  { key: 'contato', label: 'Contato', full: true },
]

const VOL_FIELDS = [
  { key: 'nome', label: 'Nome Completo', full: true },
  { key: 'logradouro', label: 'Logradouro', full: true },
  { key: 'cidade', label: 'Cidade' },
  { key: 'uf', label: 'UF' },
  { key: 'cep', label: 'CEP' },
  { key: 'contato', label: 'Contato', full: true },
]

export default function PerfilPage() {
  const { user, isInst } = useAuth()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState(
    isInst
      ? { nome: '', setor: '', logradouro: '', numero: '', cidade: '', uf: '', cep: '', contato: '' }
      : { nome: '', logradouro: '', cidade: '', uf: '', cep: '', contato: '', habilidades: [], disponibilidade: [] }
  )

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function save() {
  setLoading(true)
  try {
    let id = null

    if (isInst) {
      const res = await buscarIdInstituicaoPorNome(form.nome)
      id = res?.id

      const body = { ...form, numero: parseInt(form.numero) || 0 }

      if (id) {
        await updateInstituicao(id, body)
      } else {
        await createInstituicao(body)
      }

    } else {
      const res = await buscarIdVoluntarioPorNome(form.nome)
      id = res?.id

      if (id) {
        await updateVoluntario(id, form)
      } else {
        await createVoluntario(form)
      }
    }

    toast('Perfil salvo com sucesso!', 'success')
  } catch (e) {
    toast(e.message || 'Erro ao salvar perfil', 'error')
  }
  setLoading(false)
}

  const fields = isInst ? INST_FIELDS : VOL_FIELDS

  return (
    <div className="page">
      <h1 className="page-title">Meu Perfil</h1>

      <div className="card" style={{ maxWidth: 580 }}>
        {/* Info do usuário */}
        <div style={{
          background: '#eff6ff', borderRadius: 10, padding: '12px 16px',
          marginBottom: 20, fontSize: 14, color: '#1e40af',
        }}>
          <strong>{user?.email}</strong>
          <span style={{ marginLeft: 10, fontSize: 13, opacity: 0.8 }}>
            {isInst ? '· Instituição' : '· Voluntário'}
          </span>
        </div>

        <div className="form-row" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {fields.map(({ key, label, type, full }) => (
            <div
              key={key}
              className="form-group"
              style={full ? { gridColumn: '1 / -1' } : {}}
            >
              <label>{label}</label>
              <input
                type={type || 'text'}
                value={form[key] || ''}
                onChange={(e) => set(key, e.target.value)}
                placeholder={label}
              />
            </div>
          ))}
        </div>

        {!isInst && (
          <>
            <div className="form-group">
              <label>Habilidades</label>
              <TagInput
                value={form.habilidades}
                onChange={(v) => set('habilidades', v)}
                placeholder="Ex: Primeiros socorros, Fotografia..."
              />
              <small style={{ color: '#999', fontSize: 12, marginTop: 4, display: 'block' }}>
                Digite uma habilidade e pressione Enter
              </small>
            </div>

            <div className="form-group">
              <label>Disponibilidade</label>
              <TagInput
                value={form.disponibilidade}
                onChange={(v) => set('disponibilidade', v)}
                placeholder="Ex: Sábados de manhã, Finais de semana..."
              />
            </div>
          </>
        )}

        <button className="btn-primary" onClick={save} disabled={loading} style={{ marginTop: 6 }}>
          {loading ? <><Spinner />Salvando...</> : 'Salvar Perfil'}
        </button>
      </div>
    </div>
  )
}
