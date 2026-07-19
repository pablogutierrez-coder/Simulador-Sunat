import { useCallback, useMemo, useState, type ReactNode } from 'react'
import { usuarios } from '../database/usuarios'
import type { Usuario } from '../types'
import { AuthContext } from './AuthStore'

export interface AuthContextValue {
  currentUser: Usuario | null
  login: (ruc: string, usuario: string, clave: string) => boolean
  logout: () => void
}

const AUTH_KEY = 'rhe-simulador.usuario'

const loadUser = (): Usuario | null => {
  const stored = window.localStorage.getItem(AUTH_KEY)
  if (!stored) {
    return null
  }

  return usuarios.find((item) => item.id === Number(stored)) ?? null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<Usuario | null>(() => loadUser())

  const login = useCallback((ruc: string, usuario: string, clave: string) => {
    const found = usuarios.find(
      (item) =>
        item.ruc === ruc.trim() &&
        item.usuario.toUpperCase() === usuario.trim().toUpperCase() &&
        item.clave === clave,
    )

    if (!found) {
      return false
    }

    window.localStorage.setItem(AUTH_KEY, String(found.id))
    setCurrentUser(found)
    return true
  }, [])

  const logout = useCallback(() => {
    window.localStorage.removeItem(AUTH_KEY)
    setCurrentUser(null)
  }, [])

  const value = useMemo(
    () => ({
      currentUser,
      login,
      logout,
    }),
    [currentUser, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
