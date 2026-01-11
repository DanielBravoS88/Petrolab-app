import { Card } from '../components/UIComponents'

function AdminPanel() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Panel de Administración</h1>

      <Card title="Tabla PSI → GPH">
        <p className="text-gray-600 mb-4">
          Configuración de la tabla de conversión Presión (PSI) → Flujo de Fuga (GPH).
        </p>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚙️ Esta funcionalidad estará disponible en la fase 2 con backend.
          </p>
        </div>
      </Card>

      <Card title="Gestión de Usuarios" className="mt-6">
        <p className="text-gray-600 mb-4">
          Administración de usuarios del sistema.
        </p>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚙️ Esta funcionalidad estará disponible en la fase 2 con backend.
          </p>
        </div>
      </Card>

      <Card title="Catálogos" className="mt-6">
        <p className="text-gray-600 mb-4">
          Configuración de catálogos (tipos de línea, productos, marcas, etc.).
        </p>
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
          <p className="text-sm text-yellow-800">
            ⚙️ Esta funcionalidad estará disponible en la fase 2 con backend.
          </p>
        </div>
      </Card>
    </div>
  )
}

export default AdminPanel
