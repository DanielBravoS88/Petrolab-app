import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Al cargar, verificar si hay sesión guardada
  useEffect(() => {
    const storedUser = localStorage.getItem('petrolab_user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error al parsear usuario:', error)
        localStorage.removeItem('petrolab_user')
      }
    }
    setLoading(false)
  }, [])

  // Login mock (fase 1 - sin backend)
  const login = async (email, password) => {
    // Simulación de login - En producción esto irá al backend
    // Usuarios mock para desarrollo
    const mockUsers = [
      {
        id: '1',
        email: 'inspector@petrolab.cl',
        nombre: 'José Cuevas',
        rol: 'OPERADOR'
      },
      {
        id: '2',
        email: 'supervisor@petrolab.cl',
        nombre: 'Alfredo Jara',
        rol: 'SUPERVISOR'
      },
      {
        id: '3',
        email: 'admin@petrolab.cl',
        nombre: 'Sergio Flores',
        rol: 'ADMIN'
      }
    ]

    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 800))

    const foundUser = mockUsers.find(u => u.email === email)
    
    if (foundUser && password === 'petrolab123') {
      const userData = { ...foundUser, token: 'mock_token_' + Date.now() }
      setUser(userData)
      localStorage.setItem('petrolab_user', JSON.stringify(userData))
      return { success: true, user: userData }
    }
    
    return { success: false, error: 'Credenciales inválidas' }
  }

  // Registro mock
  const register = async (nombre, email, password, rol = 'OPERADOR') => {
    // Simulación de registro
    await new Promise(resolve => setTimeout(resolve, 800))
    
    const newUser = {
      id: Date.now().toString(),
      email,
      nombre,
      rol
    }
    
    const userData = { ...newUser, token: 'mock_token_' + Date.now() }
    setUser(userData)
    localStorage.setItem('petrolab_user', JSON.stringify(userData))
    
    return { success: true, user: userData }
  }

  // Logout
  const logout = () => {
    setUser(null)
    localStorage.removeItem('petrolab_user')
    localStorage.removeItem('petrolab_cartillas_draft')
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}
