import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem('ss_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Decode token payload to hydrate user state on page refresh
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]))
        setUser({ id: payload.sub, email: payload.email })
      } catch {
        logout()
      }
    }
    setLoading(false)
  }, [token])

  function login(newToken) {
    localStorage.setItem('ss_token', newToken)
    setToken(newToken)
    const payload = JSON.parse(atob(newToken.split('.')[1]))
    setUser({ id: payload.sub, email: payload.email })
  }

  function logout() {
    localStorage.removeItem('ss_token')
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
