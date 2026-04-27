const BASE_URL = 'https://hackaton-backend-p1z0.onrender.com'
const BASE_URL_DEV='http://127.0.0.1:8000'

function getUser() {
  return JSON.parse(localStorage.getItem('vh_user') || 'null')
}

export async function apiCall(path, options = {}) {
  const user = getUser()
  const headers = {
    'Content-Type': 'application/json',
    ...(import.meta.env.VITE_API_KEY ? { 'X-API-Key': import.meta.env.VITE_API_KEY } : {}),
    ...(options.headers || {}),
  }

  const res = await fetch(`BASE_URL${path}`, { ...options, headers })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.detail?.[0]?.msg || `Erro ${res.status}`)
  }

  return res.json().catch(() => ({}))
}

// Auth
export const login = (data) =>
  apiCall('/api/v1/login', { method: 'POST', body: JSON.stringify(data) })

export const cadastro = (data) =>
  apiCall('/api/v1/cadastro', { method: 'POST', body: JSON.stringify(data) })

// Sessions (chat)
export const createSession = () =>
  apiCall('/api/v1/sessions', { method: 'POST', body: '{}' })

export const closeSession = (sessionId) =>
  apiCall(`/api/v1/sessions/${sessionId}`, { method: 'DELETE' })

export const sendChat = (sessionId, message) =>
  apiCall('/api/v1/chat', {
    method: 'POST',
    body: JSON.stringify({ session_id: sessionId, message }),
  })

// Genericos
export const getAll = (collection) => apiCall(`api/v1/collections/${collection}`)  
export const getById = (collection, id) => apiCall(`api/v1/collections/${collection}/${id}`) 

// Voluntários
export const createVoluntario = (data) =>
  apiCall('/api/v1/voluntarios', { method: 'POST', body: JSON.stringify(data) })
export const updateVoluntario = (id, data) =>
  apiCall(`/api/v1/voluntarios/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const listarVoluntarios = () => apiCall('/api/v1/collections/voluntarios')
export const buscarIdVoluntarioPorNome = (nome) => 
  apiCall(`/api/v1/voluntarios/buscarId?nome=${encodeURIComponent(nome)}`)

// Instituições
export const createInstituicao = (data) =>
  apiCall('/api/v1/instituicoes', { method: 'POST', body: JSON.stringify(data) })
export const updateInstituicao = (id, data) =>
  apiCall(`/api/v1/instituicoes/${id}`, { method: 'PUT', body: JSON.stringify(data) })
export const buscarIdInstituicaoPorNome = (nome) => 
  apiCall(`/api/v1/instituicoes/buscarId?nome=${encodeURIComponent(nome)}`)

// Convites
export const criarConvite = (data) =>
  apiCall('/api/v1/convites', { method: 'POST', body: JSON.stringify(data) })
export const updateConviteStatus = (id, status) =>
  apiCall(`/api/v1/convites/${id}?status=${encodeURIComponent(status)}`, { method: 'PUT'})
export const getCollection = (name) =>
  apiCall(`/api/v1/collections/${name}`)
