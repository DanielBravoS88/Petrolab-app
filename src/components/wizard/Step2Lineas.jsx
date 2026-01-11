import { useState } from 'react'
import { FormField, Alert } from '../UIComponents'
import { TIPOS_LINEA, DIAMETROS_PULGADAS, PRODUCTOS, EQUIPOS_INSPECCION } from '../../config/catalogs'

function Step2Lineas({ formData, updateFormData }) {
  const [editingIndex, setEditingIndex] = useState(null)
  const [lineaForm, setLineaForm] = useState(getEmptyLinea())

  function getEmptyLinea() {
    return {
      numeroLinea: '',
      numeroEstanque: '',
      capacidadLitros: '',
      numeroSerieEstanque: '',
      bocas: '',
      tipoLinea: 'Acero',
      diametroPulgadas: '2"',
      producto: 'Gasolina 93',
      equipoInspeccion: '',
      presionInicial: '',
      presion5min: '',
      presion25min: '',
      funcionalidadDetector: '',
      resultadoHermeticidad: 'PASA'
    }
  }

  const handleAddLinea = () => {
    if (!lineaForm.numeroLinea || !lineaForm.numeroEstanque) {
      alert('Número de línea y estanque son requeridos')
      return
    }

    const newLineas = [...formData.lineas, { ...lineaForm, id: Date.now().toString() }]
    updateFormData({ lineas: newLineas })
    setLineaForm(getEmptyLinea())
  }

  const handleEditLinea = (index) => {
    setEditingIndex(index)
    setLineaForm(formData.lineas[index])
  }

  const handleUpdateLinea = () => {
    const newLineas = [...formData.lineas]
    newLineas[editingIndex] = lineaForm
    updateFormData({ lineas: newLineas })
    setEditingIndex(null)
    setLineaForm(getEmptyLinea())
  }

  const handleDeleteLinea = (index) => {
    if (window.confirm('¿Está seguro de eliminar esta línea?')) {
      const newLineas = formData.lineas.filter((_, i) => i !== index)
      updateFormData({ lineas: newLineas })
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setLineaForm(getEmptyLinea())
  }

  return (
    <div className="space-y-6">
      <h2 className="section-title">Paso 2: Líneas y Tanques</h2>

      <Alert
        type="info"
        message="Agregue las líneas a inspeccionar. Esta información se utilizará en las pruebas del siguiente paso."
      />

      {/* Formulario de línea */}
      <div className="bg-petrolab-blue-50 border-2 border-petrolab-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-petrolab-blue-900 mb-4">
          {editingIndex !== null ? 'Editar Línea' : 'Agregar Nueva Línea'}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="N° Línea" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="L-01"
              value={lineaForm.numeroLinea}
              onChange={(e) => setLineaForm({ ...lineaForm, numeroLinea: e.target.value })}
            />
          </FormField>

          <FormField label="N° Estanque" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="T-01"
              value={lineaForm.numeroEstanque}
              onChange={(e) => setLineaForm({ ...lineaForm, numeroEstanque: e.target.value })}
            />
          </FormField>

          <FormField label="Capacidad (Litros)">
            <input
              type="number"
              className="input-petrolab"
              placeholder="50000"
              value={lineaForm.capacidadLitros}
              onChange={(e) => setLineaForm({ ...lineaForm, capacidadLitros: e.target.value })}
            />
          </FormField>

          <FormField label="N° Serie Estanque">
            <input
              type="text"
              className="input-petrolab"
              placeholder="SN123456"
              value={lineaForm.numeroSerieEstanque}
              onChange={(e) => setLineaForm({ ...lineaForm, numeroSerieEstanque: e.target.value })}
            />
          </FormField>

          <FormField label="Bocas">
            <input
              type="text"
              className="input-petrolab"
              placeholder="06B0, 06B1"
              value={lineaForm.bocas}
              onChange={(e) => setLineaForm({ ...lineaForm, bocas: e.target.value })}
            />
          </FormField>

          <FormField label="Tipo de Línea">
            <select
              className="select-petrolab"
              value={lineaForm.tipoLinea}
              onChange={(e) => setLineaForm({ ...lineaForm, tipoLinea: e.target.value })}
            >
              {TIPOS_LINEA.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Diámetro">
            <select
              className="select-petrolab"
              value={lineaForm.diametroPulgadas}
              onChange={(e) => setLineaForm({ ...lineaForm, diametroPulgadas: e.target.value })}
            >
              {DIAMETROS_PULGADAS.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Producto">
            <select
              className="select-petrolab"
              value={lineaForm.producto}
              onChange={(e) => setLineaForm({ ...lineaForm, producto: e.target.value })}
            >
              {PRODUCTOS.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Equipo de Inspección">
            <input
              type="text"
              className="input-petrolab"
              placeholder="FX-M2-U3"
              list="equipos"
              value={lineaForm.equipoInspeccion}
              onChange={(e) => setLineaForm({ ...lineaForm, equipoInspeccion: e.target.value })}
            />
            <datalist id="equipos">
              {EQUIPOS_INSPECCION.map(eq => (
                <option key={eq} value={eq} />
              ))}
            </datalist>
          </FormField>
        </div>

        <div className="mt-4 flex gap-3">
          {editingIndex !== null ? (
            <>
              <button onClick={handleUpdateLinea} className="btn-petrolab">
                ✓ Actualizar Línea
              </button>
              <button onClick={handleCancelEdit} className="btn-secondary">
                Cancelar
              </button>
            </>
          ) : (
            <button onClick={handleAddLinea} className="btn-petrolab">
              ➕ Agregar Línea
            </button>
          )}
        </div>
      </div>

      {/* Tabla de líneas agregadas */}
      {formData.lineas.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">
            Líneas Agregadas ({formData.lineas.length})
          </h3>
          
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
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.lineas.map((linea, index) => (
                  <tr key={linea.id || index}>
                    <td className="font-semibold">{linea.numeroLinea}</td>
                    <td>{linea.numeroEstanque}</td>
                    <td>{linea.capacidadLitros ? Number(linea.capacidadLitros).toLocaleString() : '-'}</td>
                    <td>{linea.tipoLinea}</td>
                    <td>{linea.diametroPulgadas}</td>
                    <td>{linea.producto}</td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLinea(index)}
                          className="text-petrolab-blue-600 hover:text-petrolab-blue-700 font-semibold"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteLinea(index)}
                          className="text-red-600 hover:text-red-700 font-semibold"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {formData.lineas.length === 0 && (
        <Alert
          type="warning"
          message="Aún no ha agregado líneas. Debe agregar al menos una línea para continuar."
        />
      )}
    </div>
  )
}

export default Step2Lineas
