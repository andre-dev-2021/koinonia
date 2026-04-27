import { useState } from 'react'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ConvitesPage from './pages/ConvitesPage'
import MeusConvitesPage from './pages/MeusConvitesPage'
import PerfilPage from './pages/PerfilPage'
import ChatPage from './pages/ChatPage'

function AppInner() {
  const { user, isInst } = useAuth()
  const [page, setPage] = useState('home')

  if (!user) return <LoginPage />

  // Guard: chat só para instituições
  const safePage = page === 'chat' && !isInst
    ? 'eventos'
    : page === 'convites' && !isInst
    ? 'meus-convites'
    : page

  function renderPage() {
    switch (safePage) {
      case 'home':          return <HomePage/>
      case 'meus-convites': return <MeusConvitesPage />
      case 'convites':      return <ConvitesPage/>
      case 'perfil':        return <PerfilPage />
      case 'chat':          return <ChatPage />
      default:              return <HomePage />
    }
  }

  return (
    <>
      <Navbar page={safePage} setPage={setPage} />
      {renderPage()}
    </>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ToastProvider>
  )
}
