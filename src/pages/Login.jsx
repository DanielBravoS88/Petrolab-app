import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Alert, Button } from '../components/UIComponents'

function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isLogin) {
        const result = await login(formData.email, formData.password)
        if (result.success) {
          navigate('/')
        } else {
          setError(result.error || 'Error al iniciar sesión')
        }
      } else {
        // Registro (mock)
        setError('Funcionalidad de registro disponible próximamente')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-petrolab-blue-600 to-petrolab-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-4">
            <span className="text-4xl font-bold text-petrolab-blue-600">P</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Petrolab</h1>
          <p className="text-petrolab-blue-100">Cartilla de Terreno de Líneas</p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Registro'}
          </h2>

          {error && (
            <Alert type="error" message={error} onClose={() => setError('')} />
          )}

          {/* Credenciales de prueba */}
          {isLogin && (
            <div className="bg-petrolab-blue-50 border border-petrolab-blue-200 rounded-lg p-4 mb-6 text-sm">
              <p className="font-semibold text-petrolab-blue-900 mb-2">Credenciales de prueba:</p>
              <p className="text-petrolab-blue-700">📧 inspector@petrolab.cl</p>
              <p className="text-petrolab-blue-700">📧 supervisor@petrolab.cl</p>
              <p className="text-petrolab-blue-700">📧 admin@petrolab.cl</p>
              <p className="text-petrolab-blue-700 mt-2">🔑 Contraseña: <strong>petrolab123</strong></p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="label-petrolab">Nombre Completo</label>
                <input
                  type="text"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="input-petrolab"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
            )}

            <div>
              <label className="label-petrolab">Correo Electrónico</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-petrolab"
                placeholder="usuario@petrolab.cl"
                required
              />
            </div>

            <div>
              <label className="label-petrolab">Contraseña</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-petrolab"
                placeholder="••••••••"
                required
              />
            </div>

            <Button
              type="submit"
              loading={loading}
              disabled={loading}
              className="btn-petrolab w-full"
            >
              {isLogin ? 'Ingresar' : 'Registrarse'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setError('')
              }}
              className="text-petrolab-blue-600 hover:text-petrolab-blue-700 font-semibold"
            >
              {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
            </button>
          </div>
        </div>

        <div className="text-center mt-8 text-petrolab-blue-100 text-sm">
          <p>© 2026 Petrolab Chile</p>
          <p className="mt-1">FR024 / PC-113 / PPL 7.1-04</p>
        </div>
      </div>
    </div>
  )
}

export default Login
