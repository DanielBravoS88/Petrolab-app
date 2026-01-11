import { useState, useEffect } from 'react'
import { FormField, Alert } from '../UIComponents'
import { TIPOS_DETECTOR, MARCAS_BOMBAS, MARCAS_DETECTORES, RESULTADOS } from '../../config/catalogs'
import { calcularFlujoFuga, obtenerInfoCalculo } from '../../config/psiGphTable'

function Step3Pruebas({ formData, updateFormData }) {
  const [editingIndex, setEditingIndex] = useState(null)
  const [pruebaForm, setPruebaForm] = useState(getEmptyPrueba())
  const [calculoInfo, setCalculoInfo] = useState(null)

  function getEmptyPrueba() {
    return {
      numeroLinea: '',
      numeroEstanque: '',
      capacidadLitros: '',
      producto: '',
      bombaSumergibleMarca: '',
      detectorMarca: '',
      detectorModelo: '',
      detectorTipo: 'ELECTRONICO',
      presionOperacionPSI: '',
      presionVerificacionPSI: '',
      presionDetencionPSI: '',
      presionPruebaPSI: '',
      flujoFugaGPH: '',
      resultado: 'PASA',
      observacion: ''
    }
  }

  // Calcular flujo de fuga automáticamente cuando cambia la presión
  useEffect(() => {
    if (pruebaForm.presionOperacionPSI) {
      const psi = parseFloat(pruebaForm.presionOperacionPSI)
      if (!isNaN(psi)) {
        const info = obtenerInfoCalculo(psi)
        setCalculoInfo(info)
        setPruebaForm(prev => ({
          ...prev,
          flujoFugaGPH: info.gph.toString()
        }))
      }
    } else {
      setCalculoInfo(null)
      setPruebaForm(prev => ({ ...prev, flujoFugaGPH: '' }))
    }
  }, [pruebaForm.presionOperacionPSI])

  const handleAddPrueba = () => {
    if (!pruebaForm.numeroLinea || !pruebaForm.numeroEstanque) {
      alert('Número de línea y estanque son requeridos')
      return
    }

    if (!pruebaForm.presionOperacionPSI) {
      alert('La presión de operación es requerida')
      return
    }

    const newPruebas = [...formData.pruebas, { ...pruebaForm, id: Date.now().toString() }]
    updateFormData({ pruebas: newPruebas })
    setPruebaForm(getEmptyPrueba())
    setCalculoInfo(null)
  }

  const handleEditPrueba = (index) => {
    setEditingIndex(index)
    setPruebaForm(formData.pruebas[index])
  }

  const handleUpdatePrueba = () => {
    const newPruebas = [...formData.pruebas]
    newPruebas[editingIndex] = pruebaForm
    updateFormData({ pruebas: newPruebas })
    setEditingIndex(null)
    setPruebaForm(getEmptyPrueba())
    setCalculoInfo(null)
  }

  const handleDeletePrueba = (index) => {
    if (window.confirm('¿Está seguro de eliminar esta prueba?')) {
      const newPruebas = formData.pruebas.filter((_, i) => i !== index)
      updateFormData({ pruebas: newPruebas })
    }
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setPruebaForm(getEmptyPrueba())
    setCalculoInfo(null)
  }

  // Autocompletar desde líneas existentes
  const handleSelectLinea = (e) => {
    const numeroLinea = e.target.value
    if (!numeroLinea) {
      return
    }
    
    const linea = formData.lineas.find(l => l.numeroLinea === numeroLinea)
    if (linea) {
      setPruebaForm(prev => ({
        ...prev,
        numeroLinea: linea.numeroLinea,
        numeroEstanque: linea.numeroEstanque,
        capacidadLitros: linea.capacidadLitros,
        producto: linea.producto
      }))
    }
    
    // Resetear el select para permitir seleccionar la misma línea de nuevo
    e.target.value = ''
  }

  return (
    <div className="space-y-6">
      <h2 className="section-title">Paso 3: Pruebas de Detector</h2>

      <Alert
        type="info"
        message="Registre las pruebas de detector para cada línea. El flujo de fuga (GPH) se calcula automáticamente según la presión de operación (PSI)."
      />

      {formData.lineas.length === 0 && (
        <Alert
          type="warning"
          message="Debe agregar líneas en el paso anterior antes de registrar pruebas."
        />
      )}

      {/* Formulario de prueba */}
      {formData.lineas.length > 0 && (
        <div className="bg-petrolab-blue-50 border-2 border-petrolab-blue-200 rounded-lg p-6">
          <h3 className="font-bold text-petrolab-blue-900 mb-4">
            {editingIndex !== null ? 'Editar Prueba' : 'Agregar Nueva Prueba'}
          </h3>

          <div className="space-y-6">
            {/* Selección de línea */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Seleccionar Línea" required>
                <select
                  className="select-petrolab"
                  onChange={(e) => handleSelectLinea(e)}
                  defaultValue=""
                >
                  <option value="">Seleccione una línea...</option>
                  {formData.lineas.map((linea, idx) => (
                    <option key={idx} value={linea.numeroLinea}>
                      {linea.numeroLinea} - {linea.producto} - Estanque {linea.numeroEstanque}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField label="N° Línea Seleccionada">
                <input
                  type="text"
                  className="input-petrolab bg-gray-100 font-bold text-petrolab-blue-600"
                  value={pruebaForm.numeroLinea || '-'}
                  readOnly
                />
              </FormField>

              <FormField label="N° Estanque">
                <input
                  type="text"
                  className="input-petrolab bg-gray-100"
                  value={pruebaForm.numeroEstanque || '-'}
                  readOnly
                />
              </FormField>
            </div>

            {/* Información del producto */}
            {pruebaForm.producto && (
              <div className="bg-petrolab-blue-100 border border-petrolab-blue-300 rounded-lg p-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-petrolab-blue-900">Producto:</span>
                  <span className="text-lg font-bold text-petrolab-blue-700">{pruebaForm.producto}</span>
                  {pruebaForm.capacidadLitros && (
                    <>
                      <span className="text-sm text-petrolab-blue-600 mx-2">•</span>
                      <span className="text-sm font-semibold text-petrolab-blue-900">Capacidad:</span>
                      <span className="text-sm text-petrolab-blue-700">{pruebaForm.capacidadLitros} L</span>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Bomba y Detector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField label="Marca Bomba Sumergible">
                <input
                  type="text"
                  className="input-petrolab"
                  placeholder="Franklin Electric"
                  list="bombas"
                  value={pruebaForm.bombaSumergibleMarca}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, bombaSumergibleMarca: e.target.value })}
                />
                <datalist id="bombas">
                  {MARCAS_BOMBAS.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </FormField>

              <FormField label="Marca Detector">
                <input
                  type="text"
                  className="input-petrolab"
                  placeholder="Veeder-Root"
                  list="detectores"
                  value={pruebaForm.detectorMarca}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, detectorMarca: e.target.value })}
                />
                <datalist id="detectores">
                  {MARCAS_DETECTORES.map(m => (
                    <option key={m} value={m} />
                  ))}
                </datalist>
              </FormField>

              <FormField label="Modelo Detector">
                <input
                  type="text"
                  className="input-petrolab"
                  placeholder="TLS-450"
                  value={pruebaForm.detectorModelo}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, detectorModelo: e.target.value })}
                />
              </FormField>
            </div>

            <FormField label="Tipo de Detector">
              <div className="flex gap-4">
                {TIPOS_DETECTOR.map(tipo => (
                  <label key={tipo} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="tipoDetector"
                      value={tipo}
                      checked={pruebaForm.detectorTipo === tipo}
                      onChange={(e) => setPruebaForm({ ...pruebaForm, detectorTipo: e.target.value })}
                      className="w-5 h-5"
                    />
                    <span className="font-semibold">{tipo}</span>
                  </label>
                ))}
              </div>
            </FormField>

            {/* Presiones */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <FormField label="Presión Operación (PSI)" required>
                <input
                  type="number"
                  step="0.1"
                  className="input-petrolab"
                  placeholder="30"
                  value={pruebaForm.presionOperacionPSI}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, presionOperacionPSI: e.target.value })}
                />
              </FormField>

              <FormField label="Presión Verificación (PSI)">
                <input
                  type="number"
                  step="0.1"
                  className="input-petrolab"
                  placeholder="28"
                  value={pruebaForm.presionVerificacionPSI}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, presionVerificacionPSI: e.target.value })}
                />
              </FormField>

              <FormField label="Presión Detención (PSI)">
                <input
                  type="number"
                  step="0.1"
                  className="input-petrolab"
                  placeholder="25"
                  value={pruebaForm.presionDetencionPSI}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, presionDetencionPSI: e.target.value })}
                />
              </FormField>

              <FormField label="Presión Prueba (PSI)">
                <input
                  type="number"
                  step="0.1"
                  className="input-petrolab"
                  placeholder="30"
                  value={pruebaForm.presionPruebaPSI}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, presionPruebaPSI: e.target.value })}
                />
              </FormField>
            </div>

            {/* Cálculo de flujo de fuga */}
            {calculoInfo && (
              <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                <h4 className="font-bold text-green-900 mb-2">✓ Cálculo Automático de Flujo de Fuga</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-green-700 mb-1">Presión de Operación:</p>
                    <p className="text-2xl font-bold text-green-900">{pruebaForm.presionOperacionPSI} PSI</p>
                  </div>
                  <div>
                    <p className="text-sm text-green-700 mb-1">Flujo de Fuga Calculado:</p>
                    <p className="text-2xl font-bold text-green-900">{calculoInfo.gph} GPH</p>
                  </div>
                </div>
                <div className="mt-3 bg-white rounded p-3">
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold">Método:</span> {calculoInfo.metodo}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{calculoInfo.mensaje}</p>
                </div>
              </div>
            )}

            {/* Resultado */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Resultado" required>
                <div className="flex gap-4">
                  {Object.values(RESULTADOS).map(resultado => (
                    <label key={resultado} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="resultado"
                        value={resultado}
                        checked={pruebaForm.resultado === resultado}
                        onChange={(e) => setPruebaForm({ ...pruebaForm, resultado: e.target.value })}
                        className="w-5 h-5"
                      />
                      <span className={`font-semibold ${resultado === 'PASA' ? 'text-green-700' : 'text-red-700'}`}>
                        {resultado}
                      </span>
                    </label>
                  ))}
                </div>
              </FormField>

              <FormField label="Observación">
                <input
                  type="text"
                  className="input-petrolab"
                  placeholder="Observaciones adicionales..."
                  value={pruebaForm.observacion}
                  onChange={(e) => setPruebaForm({ ...pruebaForm, observacion: e.target.value })}
                />
              </FormField>
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            {editingIndex !== null ? (
              <>
                <button onClick={handleUpdatePrueba} className="btn-petrolab">
                  ✓ Actualizar Prueba
                </button>
                <button onClick={handleCancelEdit} className="btn-secondary">
                  Cancelar
                </button>
              </>
            ) : (
              <button onClick={handleAddPrueba} className="btn-petrolab">
                ➕ Agregar Prueba
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tabla de pruebas agregadas */}
      {formData.pruebas.length > 0 && (
        <div>
          <h3 className="font-bold text-gray-900 mb-3">
            Pruebas Registradas ({formData.pruebas.length})
          </h3>
          
          <div className="overflow-x-auto">
            <table className="table-petrolab">
              <thead>
                <tr>
                  <th>N° Línea</th>
                  <th>Estanque</th>
                  <th>Detector</th>
                  <th>Presión Op. (PSI)</th>
                  <th>Flujo Fuga (GPH)</th>
                  <th>Resultado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {formData.pruebas.map((prueba, index) => (
                  <tr key={prueba.id || index}>
                    <td className="font-semibold">{prueba.numeroLinea}</td>
                    <td>{prueba.numeroEstanque}</td>
                    <td>{prueba.detectorMarca || '-'} {prueba.detectorModelo || ''}</td>
                    <td className="text-center font-mono">{prueba.presionOperacionPSI}</td>
                    <td className="text-center font-mono font-bold text-petrolab-blue-600">
                      {prueba.flujoFugaGPH}
                    </td>
                    <td>
                      <span className={`badge ${prueba.resultado === 'PASA' ? 'badge-aprobada' : 'badge-rechazada'}`}>
                        {prueba.resultado}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditPrueba(index)}
                          className="text-petrolab-blue-600 hover:text-petrolab-blue-700 font-semibold"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeletePrueba(index)}
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

      {formData.pruebas.length === 0 && formData.lineas.length > 0 && (
        <Alert
          type="warning"
          message="Aún no ha registrado pruebas. Debe agregar al menos una prueba para continuar."
        />
      )}
    </div>
  )
}

export default Step3Pruebas
