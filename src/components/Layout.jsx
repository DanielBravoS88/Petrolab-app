import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    if (window.confirm('¿Está seguro que desea cerrar sesión?')) {
      logout()
      navigate('/login')
    }
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="header-petrolab sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Logo y título */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center font-bold text-petrolab-blue-600 text-xl">
                P
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold">Petrolab</h1>
                <p className="text-sm text-petrolab-blue-100">Cartilla de Terreno de Líneas</p>
              </div>
            </div>

            {/* Usuario */}
            <div className="flex items-center gap-4">
              <div className="text-right hidden md:block">
                <p className="font-semibold">{user?.nombre}</p>
                <p className="text-sm text-petrolab-blue-100">{user?.rol}</p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white text-petrolab-blue-600 rounded-lg font-semibold hover:bg-petrolab-blue-50 transition-colors"
              >
                Salir
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-[88px] md:top-[72px] z-40">
        <div className="container mx-auto px-4">
          <div className="flex overflow-x-auto">
            <NavLink to="/" isActive={isActive('/')}>
              📋 Dashboard
            </NavLink>
            <NavLink to="/nueva-cartilla" isActive={isActive('/nueva-cartilla')}>
              ➕ Nueva Cartilla
            </NavLink>
            {user?.rol === 'ADMIN' && (
              <NavLink to="/admin" isActive={isActive('/admin')}>
                ⚙️ Admin
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 pb-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-petrolab-blue-700 text-white py-4 mt-12">
        <div className="container mx-auto px-4 text-center text-sm">
          <p>© 2026 Petrolab Chile - Sistema de Cartilla de Terreno</p>
          <p className="text-petrolab-blue-200 mt-1">
            FR024 / PC-113 / PPL 7.1-04
          </p>
        </div>
      </footer>
    </div>
  )
}

function NavLink({ to, isActive, children }) {
  return (
    <Link
      to={to}
      className={`
        px-6 py-4 font-semibold whitespace-nowrap transition-colors
        ${isActive 
          ? 'text-petrolab-blue-600 border-b-4 border-petrolab-blue-600 bg-petrolab-blue-50' 
          : 'text-gray-600 hover:text-petrolab-blue-600 hover:bg-gray-50'
        }
      `}
    >
      {children}
    </Link>
  )
}

export default Layout
