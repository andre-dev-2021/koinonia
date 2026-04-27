import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() =>
    JSON.parse(localStorage.getItem('vh_user') || 'null')
  )

  function login(userData) {
    // Normaliza o objeto do usuário independente do shape retornado pela API
    const normalized = {
      id: userData.id || userData.uid || userData.email,
      email: userData.email,
      nome: userData.nome || userData.name || userData.email,
      tipo: userData.tipo || userData.type || userData.role || 'voluntario',
      apiKey: userData.api_key || userData.apiKey || userData.token || '',
    }
    localStorage.setItem('vh_user', JSON.stringify(normalized))
    setUser(normalized)
    return normalized
  }

  function logout() {
    localStorage.removeItem('vh_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isInst: user?.tipo === 'instituicao' }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
