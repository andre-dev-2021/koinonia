import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'

export default function HomePage(){
    const { user, isInst } = useAuth()
    const toast = useToast()

    return(
        <div className="page">
            <div className="hero">
                <div>
                    <h1>👋 Bem-vindo(a)!</h1>
                    <p>Estamos felizes em ter você aqui.</p>
                </div>
            </div>
        </div>
    )
}