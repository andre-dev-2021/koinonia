import { createContext, useContext, useState, useEffect } from 'react'

const ToastContext = createContext(null)

function ToastItem({ msg, type, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 3200)
    return () => clearTimeout(t)
  }, [])
  return <div className={`toast toast-${type}`}>{msg}</div>
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  function addToast(msg, type = 'success') {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, msg, type }])
  }

  function remove(id) {
    setToasts((t) => t.filter((x) => x.id !== id))
  }

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {toasts.map((t) => (
        <ToastItem key={t.id} msg={t.msg} type={t.type} onDone={() => remove(t.id)} />
      ))}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
