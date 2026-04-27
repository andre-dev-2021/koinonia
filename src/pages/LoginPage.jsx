import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { login as loginApi, cadastro as cadastroApi } from '../services/api'
import { Spinner } from '../components/UI'

export default function LoginPage() {
  const { login } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ email: '', password: '', tipo: 'voluntario', nome: '' })
  const [loading, setLoading] = useState(false)

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function submit() {
    if (!form.email || !form.password) {
      toast('Preencha e-mail e senha', 'error')
      return
    }
    setLoading(true)
    try {
      if (tab === 'registrar') {
        if (!form.nome) {
          toast('Preencha o nome', 'error')
          setLoading(false)
          return
        }
        await cadastroApi({
          nome: form.nome,
          email: form.email,
          password: form.password,
          tipo: form.tipo
        })
        toast('Cadastro realizado! Faça login.', 'success')
        setTab('login')
      } else {
        const res = await loginApi({ email: form.email, password: form.password })
        login({ ...res, tipo: res.tipo || res.type || res.role || form.tipo })
        toast('Bem-vindo!', 'success')
      }
    } catch (e) {
      toast(tab === 'registrar' ? 'Erro ao cadastrar. Verifique os dados.' : 'Credenciais inválidas ou erro na API', 'error')
    }
    setLoading(false)
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: '#f5f5f0', padding: 16,
    }}>
      <div style={{ width: '100%', maxWidth: 380 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 30, fontWeight: 700, color: '#1d4ed8', letterSpacing: '-1px', marginBottom: 4 }}>
            Koinonia
          </div>
          <div style={{ fontSize: 14, color: '#999' }}>
            Plataforma inteligente de recrutamento de voluntários
          </div>
        </div>

        <div className="card">
          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: '1px solid #eee', marginBottom: 20 }}>
            {['login', 'registrar'].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                style={{
                  flex: 1, background: 'none', border: 'none', padding: '10px 0',
                  fontWeight: tab === t ? 600 : 400,
                  color: tab === t ? '#1d4ed8' : '#888',
                  borderBottom: tab === t ? '2px solid #1d4ed8' : '2px solid transparent',
                  cursor: 'pointer', fontSize: 14, transition: 'all .15s',
                }}
              >
                {t === 'login' ? 'Entrar' : 'Registrar'}
              </button>
            ))}
          </div>

          <div className="form-group">
            <label>E-mail</label>
            <input
              type="email" value={form.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder="seu@email.com"
            />
          </div>

          <div className="form-group">
            <label>Senha</label>
            <input
              type="password" value={form.password}
              onChange={(e) => set('password', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submit()}
              placeholder="••••••••"
            />
          </div>

          {tab === 'registrar' && (
            <>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text" value={form.nome}
                  onChange={(e) => set('nome', e.target.value)}
                  placeholder="Seu nome ou instituição"
                />
              </div>

              <div className="form-group">
                <label>Tipo de conta</label>
                <select value={form.tipo} onChange={(e) => set('tipo', e.target.value)}>
                  <option value="voluntario">Voluntário</option>
                  <option value="instituicao">Instituição</option>
                </select>
              </div>
            </>
          )}

          <button
            className="btn-primary"
            style={{ width: '100%', marginTop: 4 }}
            onClick={submit}
            disabled={loading}
          >
            {loading ? <><Spinner />Aguarde...</> : tab === 'login' ? 'Entrar' : 'Criar conta'}
          </button>

          {/*<button
            onClick={() => {
              login({ id: 999, nome: 'Demo User', email: 'demo@teste.com', tipo: 'voluntario' })
              toast('Modo demonstração ativado', 'success')
            }}
            style={{
              width: '100%', marginTop: 12, padding: '8px 0',
              background: 'transparent', border: '1px dashed #ccc',
              borderRadius: 6, color: '#888', fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Modo demonstração
          </button>*/}
        </div>

        <p style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: '#bbb' }}>
          Selecione &quot;Registrar&quot; para escolher o tipo de conta
        </p>
      </div>
    </div>
  )
}
