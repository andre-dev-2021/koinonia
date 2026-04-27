import { useAuth } from '../contexts/AuthContext'

export default function Navbar({ page, setPage }) {
  const { user, logout, isInst } = useAuth()

  const links = isInst
    ? [
        ['home', 'Pagina Inicial'],
        ['convites', 'Convites enviados'],
        ['chat', 'Chat IA'],
        ['perfil', 'Perfil']
      ]
    : [
        ['home', 'Pagina Inicial'],
        ['meus-convites', 'Meus Convites'],
        ['perfil', 'Perfil']
      ]

  return (
    <nav className="nav">
      <div className="nav-logo">Koinonia</div>

      <div className="nav-links">
        {links.map(([key, label]) => (
          <button
            key={key}
            className={`nav-link${page === key ? ' active' : ''}`}
            onClick={() => setPage(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="nav-user">
        <span style={{ fontSize: 13, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {user?.nome || user?.email}
        </span>
        <span className={`badge ${isInst ? 'badge-blue' : 'badge-green'}`}>
          {isInst ? 'Instituição' : 'Voluntário'}
        </span>
        <button className="btn-secondary btn-sm" onClick={logout}>
          Sair
        </button>
      </div>
    </nav>
  )
}
