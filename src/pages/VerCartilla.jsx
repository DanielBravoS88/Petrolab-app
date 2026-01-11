import { useParams, useNavigate, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Card, EstadoBadge, LoadingSpinner, Alert, ConfirmDialog } from '../components/UIComponents'
import { exportarCartillaPDF } from '../utils/pdfExport'
import { format } from 'date-fns'
import { useAuth } from '../context/AuthContext'
import { ESTADOS_CARTILLA } from '../config/catalogs'

function VerCartilla() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [cartilla, setCartilla] = useState(null)
  const [loading, setLoading] = useState(true)
  const [alert, setAlert] = useState(null)
  const [showApprovalDialog, setShowApprovalDialog] = useState(false)
  const [showRejectionDialog, setShowRejectionDialog] = useState(false)
  const [comentarioRechazo, setComentarioRechazo] = useState('')

  useEffect(() => {
    cargarCartilla()
  }, [id])

  const cargarCartilla = () => {
    try {
      const stored = localStorage.getItem('petrolab_cartillas')
      if (stored) {
        const cartillas = JSON.parse(stored)
        const found = cartillas.find(c => c.id === id)
        if (found) {
          setCartilla(found)
        } else {
          setAlert({ type: 'error', message: 'Cartilla no encontrada' })
        }
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar cartilla' })
    } finally {
      setLoading(false)
    }
  }

  const handleExportarPDF = async () => {
    try {
      setAlert({ type: 'info', message: 'Generando PDF...' })
      await exportarCartillaPDF(cartilla)
      setAlert({ type: 'success', message: 'PDF generado exitosamente' })
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al generar PDF' })
    }
  }

  const handleAprobar = () => {
    try {
      const stored = localStorage.getItem('petrolab_cartillas')
      if (!stored) {
        setAlert({ type: 'error', message: 'No se encontraron cartillas' })
        return
      }

      const cartillas = JSON.parse(stored)
      const index = cartillas.findIndex(c => c.id === id)
      
      console.log('Aprobando cartilla:', { id, index, estado_actual: cartillas[index]?.estado })
      
      if (index !== -1) {
        cartillas[index] = {
          ...cartillas[index],
          estado: 'APROBADA',
          aprobadaPor: user?.email,
          aprobadaEn: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comentariosRevision: [
            ...(cartillas[index].comentariosRevision || []),
            {
              usuario: user?.email,
              fecha: new Date().toISOString(),
              accion: 'APROBADA',
              comentario: 'Cartilla aprobada'
            }
          ]
        }
        
        console.log('Guardando cartilla aprobada:', cartillas[index])
        localStorage.setItem('petrolab_cartillas', JSON.stringify(cartillas))
        
        setCartilla(cartillas[index])
        setAlert({ type: 'success', message: '✅ Cartilla aprobada exitosamente' })
        setShowApprovalDialog(false)
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setAlert({ type: 'error', message: 'Cartilla no encontrada' })
      }
    } catch (error) {
      console.error('Error al aprobar:', error)
      setAlert({ type: 'error', message: 'Error al aprobar cartilla: ' + error.message })
    }
  }

  const handleRechazar = () => {
    if (!comentarioRechazo.trim()) {
      setAlert({ type: 'warning', message: 'Debe ingresar un comentario de rechazo' })
      return
    }

    try {
      const stored = localStorage.getItem('petrolab_cartillas')
      if (!stored) {
        setAlert({ type: 'error', message: 'No se encontraron cartillas' })
        return
      }

      const cartillas = JSON.parse(stored)
      const index = cartillas.findIndex(c => c.id === id)
      
      console.log('Rechazando cartilla:', { id, index, estado_actual: cartillas[index]?.estado })
      
      if (index !== -1) {
        cartillas[index] = {
          ...cartillas[index],
          estado: 'RECHAZADA',
          rechazadaPor: user?.email,
          rechazadaEn: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          comentariosRevision: [
            ...(cartillas[index].comentariosRevision || []),
            {
              usuario: user?.email,
              fecha: new Date().toISOString(),
              accion: 'RECHAZADA',
              comentario: comentarioRechazo
            }
          ]
        }
        
        console.log('Guardando cartilla rechazada:', cartillas[index])
        localStorage.setItem('petrolab_cartillas', JSON.stringify(cartillas))
        
        setCartilla(cartillas[index])
        setAlert({ type: 'success', message: '❌ Cartilla rechazada' })
        setShowRejectionDialog(false)
        setComentarioRechazo('')
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          navigate('/')
        }, 2000)
      } else {
        setAlert({ type: 'error', message: 'Cartilla no encontrada' })
      }
    } catch (error) {
      console.error('Error al rechazar:', error)
      setAlert({ type: 'error', message: 'Error al rechazar cartilla: ' + error.message })
    }
  }

  const puedeRevisar = () => {
    // Solo supervisores y admins pueden revisar
    if (!user || (user.rol !== 'SUPERVISOR' && user.rol !== 'ADMIN')) {
      console.log('No puede revisar - Rol:', user?.rol)
      return false
    }
    // Solo pueden revisar cartillas en estado EN_REVISION
    const puede = cartilla?.estado === 'EN_REVISION'
    console.log('Puede revisar:', puede, '- Estado cartilla:', cartilla?.estado)
    return puede
  }

  if (loading) {
    return <LoadingSpinner text="Cargando cartilla..." />
  }

  if (!cartilla) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Cartilla no encontrada</p>
        <Link to="/" className="btn-petrolab">
          Volver al Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Cartilla UOM {cartilla.uomNumero}</h1>
          <p className="text-gray-600 mt-1">FR024 / PC-113 / PPL 7.1-04</p>
        </div>
        <div className="flex flex-wrap gap-3">
          {cartilla.estado === 'BORRADOR' && (
            <Link to={`/editar-cartilla/${cartilla.id}`} className="btn-secondary">
              ✏️ Editar
            </Link>
          )}
          {puedeRevisar() && (
            <>
              <button 
                onClick={() => setShowApprovalDialog(true)} 
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ✅ Aprobar
              </button>
              <button 
                onClick={() => setShowRejectionDialog(true)} 
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                ❌ Rechazar
              </button>
            </>
          )}
          <button onClick={handleExportarPDF} className="btn-petrolab">
            📄 Exportar PDF
          </button>
        </div>
      </div>

      {alert && (
        <Alert type={alert.type} message={alert.message} onClose={() => setAlert(null)} />
      )}

      {/* Estado y datos básicos */}
      <Card>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <EstadoBadge estado={cartilla.estado} />
          <span className="text-gray-600">
            Creada el {formatDate(cartilla.createdAt)}
          </span>
          {cartilla.aprobadaPor && (
            <span className="text-sm text-green-600">
              ✅ Aprobada por {cartilla.aprobadaPor} el {formatDate(cartilla.aprobadaEn)}
            </span>
          )}
          {cartilla.rechazadaPor && (
            <span className="text-sm text-red-600">
              ❌ Rechazada por {cartilla.rechazadaPor} el {formatDate(cartilla.rechazadaEn)}
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <InfoItem label="Fecha de Prueba" value={formatDate(cartilla.fechaPrueba)} />
          <InfoItem label="Hora Inicio" value={cartilla.horaInicio || '-'} />
          <InfoItem label="Hora Término" value={cartilla.horaTermino || '-'} />
          <InfoItem label="Inspector" value={cartilla.inspectorNombre} />
        </div>
      </Card>

      {/* Comentarios de revisión */}
      {cartilla.comentariosRevision && cartilla.comentariosRevision.length > 0 && (
        <Card title="Historial de Revisión">
          <div className="space-y-3">
            {cartilla.comentariosRevision.map((comentario, idx) => (
              <div key={idx} className={`border-l-4 pl-4 py-2 ${
                comentario.accion === 'APROBADA' ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{comentario.usuario}</span>
                  <span className="text-sm text-gray-500">{formatDate(comentario.fecha)}</span>
                  <span className={`badge ${comentario.accion === 'APROBADA' ? 'badge-aprobada' : 'badge-rechazada'}`}>
                    {comentario.accion}
                  </span>
                </div>
                <p className="text-gray-700">{comentario.comentario}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Instalación */}
      <Card title="Datos de Instalación">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <InfoItem label="RUT" value={cartilla.instalacion.rut} />
          <InfoItem label="Nombre del Sitio" value={cartilla.instalacion.nombreSitio} />
          <InfoItem label="Compañía" value={cartilla.instalacion.compania} />
          <InfoItem label="Código" value={cartilla.instalacion.codigo} />
          <InfoItem label="Dirección" value={cartilla.instalacion.direccion} />
          <InfoItem label="Comuna" value={cartilla.instalacion.comuna} />
          <InfoItem label="Ciudad" value={cartilla.instalacion.ciudad} />
          <InfoItem label="Región" value={cartilla.instalacion.region} />
          <InfoItem label="Teléfono" value={cartilla.instalacion.telefono} />
        </div>
      </Card>

      {/* Mandante */}
      <Card title="Datos de Mandante">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <InfoItem label="Tipo" value={cartilla.mandante.tipo} />
          <InfoItem label="File N°" value={cartilla.mandante.fileNumero} />
          <InfoItem label="Nombre Legal" value={cartilla.mandante.nombreLegal} />
          <InfoItem label="Descripción" value={cartilla.mandante.descripcion} />
        </div>
      </Card>

      {/* Líneas */}
      <Card title={`Líneas y Tanques (${cartilla.lineas?.length || 0})`}>
        {cartilla.lineas && cartilla.lineas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-petrolab">
              <thead>
                <tr>
                  <th>N° Línea</th>
                  <th>N° Estanque</th>
                  <th>Capacidad (L)</th>
                  <th>Tipo</th>
                  <th>Diámetro</th>
                  <th>Producto</th>
                  <th>Bocas</th>
                </tr>
              </thead>
              <tbody>
                {cartilla.lineas.map((linea, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{linea.numeroLinea}</td>
                    <td>{linea.numeroEstanque}</td>
                    <td>{linea.capacidadLitros ? Number(linea.capacidadLitros).toLocaleString() : '-'}</td>
                    <td>{linea.tipoLinea}</td>
                    <td>{linea.diametroPulgadas}</td>
                    <td>{linea.producto}</td>
                    <td className="text-sm">{linea.bocas || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay líneas registradas</p>
        )}
      </Card>

      {/* Pruebas */}
      <Card title={`Pruebas de Detector (${cartilla.pruebas?.length || 0})`}>
        {cartilla.pruebas && cartilla.pruebas.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table-petrolab">
              <thead>
                <tr>
                  <th>N° Línea</th>
                  <th>Estanque</th>
                  <th>Detector</th>
                  <th>Tipo</th>
                  <th>P. Operación (PSI)</th>
                  <th>Flujo Fuga (GPH)</th>
                  <th>Resultado</th>
                  <th>Observación</th>
                </tr>
              </thead>
              <tbody>
                {cartilla.pruebas.map((prueba, idx) => (
                  <tr key={idx}>
                    <td className="font-semibold">{prueba.numeroLinea}</td>
                    <td>{prueba.numeroEstanque}</td>
                    <td className="text-sm">{prueba.detectorMarca} {prueba.detectorModelo}</td>
                    <td>{prueba.detectorTipo}</td>
                    <td className="text-center font-mono">{prueba.presionOperacionPSI}</td>
                    <td className="text-center font-mono font-bold text-petrolab-blue-600">
                      {prueba.flujoFugaGPH}
                    </td>
                    <td>
                      <span className={`badge ${prueba.resultado === 'PASA' ? 'badge-aprobada' : 'badge-rechazada'}`}>
                        {prueba.resultado}
                      </span>
                    </td>
                    <td className="text-sm">{prueba.observacion || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No hay pruebas registradas</p>
        )}
      </Card>

      {/* Personal y Firmas */}
      <Card title="Personal y Firmas">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <InfoItem label="Inspector" value={cartilla.inspectorNombre} />
          <InfoItem label="Ayudante" value={cartilla.ayudanteNombre || '-'} />
          <InfoItem label="Administrador" value={cartilla.administradorNombre || '-'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cartilla.firmaAdministrador && (
            <div>
              <p className="label-petrolab">Firma Administrador</p>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                <img src={cartilla.firmaAdministrador} alt="Firma Administrador" className="max-h-32 mx-auto" />
              </div>
            </div>
          )}
          {cartilla.firmaInspector && (
            <div>
              <p className="label-petrolab">Firma Inspector</p>
              <div className="border-2 border-gray-300 rounded-lg p-4 bg-white">
                <img src={cartilla.firmaInspector} alt="Firma Inspector" className="max-h-32 mx-auto" />
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Botones */}
      <div className="flex gap-3 justify-between">
        <button onClick={() => navigate('/')} className="btn-secondary">
          ← Volver al Dashboard
        </button>
        <button onClick={handleExportarPDF} className="btn-petrolab">
          📄 Exportar PDF
        </button>
      </div>

      {/* Diálogos de confirmación */}
      {showApprovalDialog && (
        <ConfirmDialog
          title="Aprobar Cartilla"
          message={`¿Está seguro de aprobar la cartilla UOM ${cartilla.uomNumero}?`}
          confirmText="✅ Aprobar"
          confirmColor="bg-green-600 hover:bg-green-700"
          onConfirm={handleAprobar}
          onCancel={() => setShowApprovalDialog(false)}
        />
      )}

      {showRejectionDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rechazar Cartilla</h3>
            <p className="text-gray-600 mb-4">
              Por favor indique el motivo del rechazo de la cartilla UOM {cartilla.uomNumero}:
            </p>
            <textarea
              className="input-petrolab w-full min-h-[120px]"
              placeholder="Ingrese el motivo del rechazo..."
              value={comentarioRechazo}
              onChange={(e) => setComentarioRechazo(e.target.value)}
              autoFocus
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => {
                  setShowRejectionDialog(false)
                  setComentarioRechazo('')
                }}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleRechazar}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex-1"
              >
                ❌ Rechazar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoItem({ label, value }) {
  return (
    <div>
      <p className="text-sm text-gray-600 mb-1">{label}</p>
      <p className="font-semibold text-gray-900">{value || '-'}</p>
    </div>
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

export default VerCartilla
