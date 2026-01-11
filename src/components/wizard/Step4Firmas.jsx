import { useRef, useState } from 'react'
import { FormField, Alert } from '../UIComponents'
import SignatureCanvas from 'react-signature-canvas'

function Step4Firmas({ formData, updateFormData }) {
  const sigAdminRef = useRef(null)
  const sigInspectorRef = useRef(null)
  const [showAdminSig, setShowAdminSig] = useState(false)
  const [showInspectorSig, setShowInspectorSig] = useState(false)

  const clearAdminSignature = () => {
    sigAdminRef.current?.clear()
    updateFormData({ firmaAdministrador: '' })
  }

  const saveAdminSignature = () => {
    if (sigAdminRef.current) {
      const dataURL = sigAdminRef.current.toDataURL()
      updateFormData({ firmaAdministrador: dataURL })
      setShowAdminSig(false)
    }
  }

  const clearInspectorSignature = () => {
    sigInspectorRef.current?.clear()
    updateFormData({ firmaInspector: '' })
  }

  const saveInspectorSignature = () => {
    if (sigInspectorRef.current) {
      const dataURL = sigInspectorRef.current.toDataURL()
      updateFormData({ firmaInspector: dataURL })
      setShowInspectorSig(false)
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="section-title">Paso 4: Datos Finales y Firmas</h2>

      <Alert
        type="info"
        message="Complete los datos finales de la inspección y las firmas de los responsables."
      />

      {/* Resumen de la cartilla */}
      <div className="bg-petrolab-blue-50 border-2 border-petrolab-blue-200 rounded-lg p-6">
        <h3 className="font-bold text-petrolab-blue-900 mb-4">📋 Resumen de la Cartilla</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-gray-600">UOM</p>
            <p className="font-bold text-lg">{formData.uomNumero || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Estación</p>
            <p className="font-bold">{formData.instalacion.nombreSitio || '-'}</p>
          </div>
          <div>
            <p className="text-gray-600">Líneas</p>
            <p className="font-bold text-lg text-petrolab-blue-600">{formData.lineas.length}</p>
          </div>
          <div>
            <p className="text-gray-600">Pruebas</p>
            <p className="font-bold text-lg text-green-600">{formData.pruebas.length}</p>
          </div>
        </div>
      </div>

      {/* Datos del personal */}
      <div>
        <h3 className="text-lg font-bold text-petrolab-blue-700 mb-4">Personal</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Inspector" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="Nombre del inspector"
              value={formData.inspectorNombre}
              onChange={(e) => updateFormData({ inspectorNombre: e.target.value })}
            />
          </FormField>

          <FormField label="Ayudante">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Nombre del ayudante"
              value={formData.ayudanteNombre}
              onChange={(e) => updateFormData({ ayudanteNombre: e.target.value })}
            />
          </FormField>

          <FormField label="Administrador de Estación" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="Nombre del administrador"
              value={formData.administradorNombre}
              onChange={(e) => updateFormData({ administradorNombre: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* Horarios */}
      <div>
        <h3 className="text-lg font-bold text-petrolab-blue-700 mb-4">Horarios</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Fecha de Prueba" required>
            <input
              type="date"
              className="input-petrolab"
              value={formData.fechaPrueba}
              onChange={(e) => updateFormData({ fechaPrueba: e.target.value })}
            />
          </FormField>

          <FormField label="Hora de Inicio" required>
            <input
              type="time"
              className="input-petrolab"
              value={formData.horaInicio}
              onChange={(e) => updateFormData({ horaInicio: e.target.value })}
            />
          </FormField>

          <FormField label="Hora de Término" required>
            <input
              type="time"
              className="input-petrolab"
              value={formData.horaTermino}
              onChange={(e) => updateFormData({ horaTermino: e.target.value })}
            />
          </FormField>
        </div>
      </div>

      {/* Firmas */}
      <div>
        <h3 className="text-lg font-bold text-petrolab-blue-700 mb-4">Firmas</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Firma Administrador */}
          <div>
            <FormField label="Firma del Administrador">
              {formData.firmaAdministrador ? (
                <div className="border-2 border-green-500 rounded-lg p-4 bg-white">
                  <img src={formData.firmaAdministrador} alt="Firma Administrador" className="max-h-32 mx-auto" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setShowAdminSig(true)} className="btn-secondary flex-1">
                      ✏️ Editar
                    </button>
                    <button onClick={clearAdminSignature} className="btn-danger flex-1">
                      🗑️ Borrar
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowAdminSig(true)} className="btn-petrolab w-full">
                  ✍️ Agregar Firma
                </button>
              )}
            </FormField>

            {showAdminSig && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                  <h4 className="font-bold text-lg mb-4">Firma del Administrador</h4>
                  <div className="border-2 border-gray-300 rounded-lg">
                    <SignatureCanvas
                      ref={sigAdminRef}
                      canvasProps={{
                        className: 'w-full h-48 touch-action-none'
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Firme en el recuadro usando el dedo o mouse
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button onClick={clearAdminSignature} className="btn-secondary flex-1">
                      Limpiar
                    </button>
                    <button onClick={() => setShowAdminSig(false)} className="btn-secondary flex-1">
                      Cancelar
                    </button>
                    <button onClick={saveAdminSignature} className="btn-petrolab flex-1">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Firma Inspector */}
          <div>
            <FormField label="Firma del Inspector (Opcional)">
              {formData.firmaInspector ? (
                <div className="border-2 border-green-500 rounded-lg p-4 bg-white">
                  <img src={formData.firmaInspector} alt="Firma Inspector" className="max-h-32 mx-auto" />
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => setShowInspectorSig(true)} className="btn-secondary flex-1">
                      ✏️ Editar
                    </button>
                    <button onClick={clearInspectorSignature} className="btn-danger flex-1">
                      🗑️ Borrar
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setShowInspectorSig(true)} className="btn-secondary w-full">
                  ✍️ Agregar Firma
                </button>
              )}
            </FormField>

            {showInspectorSig && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6">
                  <h4 className="font-bold text-lg mb-4">Firma del Inspector</h4>
                  <div className="border-2 border-gray-300 rounded-lg">
                    <SignatureCanvas
                      ref={sigInspectorRef}
                      canvasProps={{
                        className: 'w-full h-48 touch-action-none'
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Firme en el recuadro usando el dedo o mouse
                  </p>
                  <div className="flex gap-3 mt-4">
                    <button onClick={clearInspectorSignature} className="btn-secondary flex-1">
                      Limpiar
                    </button>
                    <button onClick={() => setShowInspectorSig(false)} className="btn-secondary flex-1">
                      Cancelar
                    </button>
                    <button onClick={saveInspectorSignature} className="btn-petrolab flex-1">
                      Guardar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Validaciones finales */}
      <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
        <h4 className="font-bold text-yellow-900 mb-2">⚠️ Antes de finalizar, verifique que:</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800">
          <li>Todos los datos de instalación estén completos</li>
          <li>Se hayan registrado todas las líneas</li>
          <li>Se hayan completado todas las pruebas</li>
          <li>Los horarios de inicio y término estén correctos</li>
          <li>Las firmas estén capturadas</li>
        </ul>
      </div>
    </div>
  )
}

export default Step4Firmas
