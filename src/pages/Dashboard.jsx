import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, EstadoBadge, LoadingSpinner } from '../components/UIComponents'
import { ESTADOS_CARTILLA } from '../config/catalogs'
import { format } from 'date-fns'

function Dashboard() {
  const { user } = useAuth()
  const [cartillas, setCartillas] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('TODAS')

  // Cargar cartillas (desde localStorage en fase 1)
  useEffect(() => {
    cargarCartillas()
    
    // Recargar cuando la ventana vuelve a estar en foco
    const handleFocus = () => {
      console.log('Dashboard refocused - recargando cartillas')
      cargarCartillas()
    }
    
    window.addEventListener('focus', handleFocus)
    
    // Recargar cuando el componente se vuelve visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('Dashboard visible - recargando cartillas')
        cargarCartillas()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    
    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  const cargarCartillas = () => {
    try {
      const stored = localStorage.getItem('petrolab_cartillas')
      console.log('Cargando cartillas desde localStorage:', stored ? 'Datos encontrados' : 'Sin datos')
      if (stored) {
        const data = JSON.parse(stored)
        console.log('Cartillas cargadas:', data.map(c => ({ id: c.id, uom: c.uomNumero, estado: c.estado })))
        setCartillas(data)
      } else {
        // Datos mock para desarrollo
        console.log('Usando datos mock')
        setCartillas(getMockCartillas())
      }
    } catch (error) {
      console.error('Error al cargar cartillas:', error)
      setCartillas(getMockCartillas())
    } finally {
      setLoading(false)
    }
  }

  const cartillasFiltradas = cartillas.filter(c => 
    filtroEstado === 'TODAS' || c.estado === filtroEstado
  )

  const stats = {
    total: cartillas.length,
    borradores: cartillas.filter(c => c.estado === ESTADOS_CARTILLA.BORRADOR).length,
    revision: cartillas.filter(c => c.estado === ESTADOS_CARTILLA.EN_REVISION).length,
    aprobadas: cartillas.filter(c => c.estado === ESTADOS_CARTILLA.APROBADA).length
  }

  if (loading) {
    return <LoadingSpinner text="Cargando cartillas..." />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Bienvenido, {user?.nombre}</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => {
              setLoading(true)
              cargarCartillas()
            }} 
            className="btn-secondary"
            title="Recargar cartillas"
          >
            🔄 Recargar
          </button>
          <Link to="/nueva-cartilla" className="btn-petrolab text-center">
            ➕ Nueva Cartilla
          </Link>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Cartillas"
          value={stats.total}
          icon="📋"
          color="bg-petrolab-blue-500"
        />
        <StatCard
          title="Borradores"
          value={stats.borradores}
          icon="📝"
          color="bg-gray-500"
        />
        <StatCard
          title="En Revisión"
          value={stats.revision}
          icon="🔍"
          color="bg-yellow-500"
        />
        <StatCard
          title="Aprobadas"
          value={stats.aprobadas}
          icon="✅"
          color="bg-green-500"
        />
      </div>

      {/* Filtros */}
      <Card title="Cartillas">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <FilterButton
            active={filtroEstado === 'TODAS'}
            onClick={() => setFiltroEstado('TODAS')}
          >
            Todas ({cartillas.length})
          </FilterButton>
          {Object.values(ESTADOS_CARTILLA).map(estado => (
            <FilterButton
              key={estado}
              active={filtroEstado === estado}
              onClick={() => setFiltroEstado(estado)}
            >
              {estado} ({cartillas.filter(c => c.estado === estado).length})
            </FilterButton>
          ))}
        </div>

        {/* Lista de cartillas */}
        {cartillasFiltradas.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-xl font-semibold">No hay cartillas</p>
            <p className="mt-2">Crea una nueva cartilla para comenzar</p>
            <Link to="/nueva-cartilla" className="btn-petrolab inline-block mt-6">
              Crear Primera Cartilla
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-petrolab">
              <thead>
                <tr>
                  <th>UOM</th>
                  <th>Estación</th>
                  <th>Fecha Prueba</th>
                  <th>Inspector</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cartillasFiltradas.map(cartilla => (
                  <tr key={cartilla.id}>
                    <td className="font-semibold">{cartilla.uomNumero}</td>
                    <td>{cartilla.instalacion.nombreSitio}</td>
                    <td>{formatDate(cartilla.fechaPrueba)}</td>
                    <td>{cartilla.inspectorNombre}</td>
                    <td>
                      <EstadoBadge estado={cartilla.estado} />
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <Link
                          to={`/ver-cartilla/${cartilla.id}`}
                          className="text-petrolab-blue-600 hover:text-petrolab-blue-700 font-semibold"
                        >
                          Ver
                        </Link>
                        {cartilla.estado === ESTADOS_CARTILLA.BORRADOR && (
                          <Link
                            to={`/editar-cartilla/${cartilla.id}`}
                            className="text-green-600 hover:text-green-700 font-semibold"
                          >
                            Editar
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  )
}

function FilterButton({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-lg font-semibold whitespace-nowrap transition-colors
        ${active 
          ? 'bg-petrolab-blue-600 text-white' 
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }
      `}
    >
      {children}
    </button>
  )
}

function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy')
  } catch {
    return dateString
  }
}

function getMockCartillas() {
  return [
    {
      id: '1',
      uomNumero: '001',
      instalacion: {
        nombreSitio: 'Estación Shell Providencia',
        rut: '96.810.370-9',
        compania: 'Shell Chile',
        direccion: 'Av. Providencia 1234',
        comuna: 'Providencia',
        ciudad: 'Santiago',
        region: 'Metropolitana'
      },
      mandante: {
        tipo: 'DF',
        fileNumero: '641',
        nombreLegal: 'ENEX',
        descripcion: 'ENEX Retail'
      },
      fechaPrueba: '2026-01-05',
      horaInicio: '09:00',
      horaTermino: '14:30',
      inspectorNombre: 'Juan Pérez',
      ayudanteNombre: 'Pedro Soto',
      estado: ESTADOS_CARTILLA.APROBADA,
      createdBy: '1',
      createdAt: '2026-01-05T09:00:00'
    },
    {
      id: '2',
      uomNumero: '002',
      instalacion: {
        nombreSitio: 'Estación Copec Las Condes',
        rut: '99.520.000-7',
        compania: 'Copec SA',
        direccion: 'Av. Apoquindo 5678',
        comuna: 'Las Condes',
        ciudad: 'Santiago',
        region: 'Metropolitana'
      },
      mandante: {
        tipo: 'COPEC',
        fileNumero: '742',
        nombreLegal: 'Copec',
        descripcion: 'Copec Retail'
      },
      fechaPrueba: '2026-01-08',
      horaInicio: '08:30',
      horaTermino: '13:00',
      inspectorNombre: 'Juan Pérez',
      ayudanteNombre: 'María López',
      estado: ESTADOS_CARTILLA.EN_REVISION,
      createdBy: '1',
      createdAt: '2026-01-08T08:30:00'
    },
    {
      id: '3',
      uomNumero: '003',
      instalacion: {
        nombreSitio: 'Estación Petrobras Maipú',
        rut: '93.410.000-1',
        compania: 'Petrobras Chile',
        direccion: 'Av. Pajaritos 3456',
        comuna: 'Maipú',
        ciudad: 'Santiago',
        region: 'Metropolitana'
      },
      mandante: {
        tipo: 'PETROBRAS',
        fileNumero: '843',
        nombreLegal: 'Petrobras',
        descripcion: 'Petrobras Retail'
      },
      fechaPrueba: '2026-01-10',
      horaInicio: '10:00',
      horaTermino: '',
      inspectorNombre: 'Juan Pérez',
      ayudanteNombre: '',
      estado: ESTADOS_CARTILLA.BORRADOR,
      createdBy: '1',
      createdAt: '2026-01-10T10:00:00'
    }
  ]
}

export default Dashboard
