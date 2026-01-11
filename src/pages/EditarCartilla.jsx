import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, Alert, LoadingSpinner } from '../components/UIComponents'
import Step1Instalacion from '../components/wizard/Step1Instalacion'
import Step2Lineas from '../components/wizard/Step2Lineas'
import Step3Pruebas from '../components/wizard/Step3Pruebas'
import Step4Firmas from '../components/wizard/Step4Firmas'

const STEPS = [
  { id: 1, nombre: 'Instalación y Mandante', component: Step1Instalacion },
  { id: 2, nombre: 'Líneas y Tanques', component: Step2Lineas },
  { id: 3, nombre: 'Pruebas de Detector', component: Step3Pruebas },
  { id: 4, nombre: 'Firmas y Finalizar', component: Step4Firmas }
]

function EditarCartilla() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [currentStep, setCurrentStep] = useState(1)
  const [alert, setAlert] = useState(null)
  const [formData, setFormData] = useState(null)

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
          if (found.estado !== 'BORRADOR') {
            setAlert({ type: 'error', message: 'Solo se pueden editar cartillas en borrador' })
            setTimeout(() => navigate('/'), 2000)
            return
          }
          setFormData(found)
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

  const updateFormData = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates,
      updatedBy: user?.id,
      updatedAt: new Date().toISOString()
    }))
  }

  const handleSave = () => {
    try {
      const stored = localStorage.getItem('petrolab_cartillas')
      const cartillas = JSON.parse(stored || '[]')
      const index = cartillas.findIndex(c => c.id === id)
      
      if (index !== -1) {
        cartillas[index] = formData
        localStorage.setItem('petrolab_cartillas', JSON.stringify(cartillas))
        setAlert({ type: 'success', message: 'Cambios guardados exitosamente' })
        setTimeout(() => navigate('/'), 1500)
      }
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar cambios' })
    }
  }

  if (loading) {
    return <LoadingSpinner text="Cargando cartilla..." />
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-xl text-gray-600 mb-4">Cartilla no encontrada</p>
        <button onClick={() => navigate('/')} className="btn-petrolab">
          Volver al Dashboard
        </button>
      </div>
    )
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Editar Cartilla UOM {formData.uomNumero}</h1>
        <p className="text-gray-600">FR024 / PC-113 / PPL 7.1-04</p>
      </div>

      {/* Wizard Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <button
                  onClick={() => setCurrentStep(step.id)}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${currentStep >= step.id
                      ? 'bg-petrolab-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                    }
                    hover:opacity-80 transition-opacity
                  `}
                >
                  {step.id}
                </button>
                <p className={`
                  text-xs mt-2 text-center hidden md:block
                  ${currentStep >= step.id ? 'text-petrolab-blue-600 font-semibold' : 'text-gray-500'}
                `}>
                  {step.nombre}
                </p>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={`
                    flex-1 h-1 mx-2
                    ${currentStep > step.id ? 'bg-petrolab-blue-600' : 'bg-gray-300'}
                  `}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      <Card>
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
        />
      </Card>

      <div className="mt-6 flex gap-3 justify-between">
        <button onClick={() => navigate('/')} className="btn-secondary">
          Cancelar
        </button>
        <button onClick={handleSave} className="btn-petrolab">
          💾 Guardar Cambios
        </button>
      </div>
    </div>
  )
}

export default EditarCartilla
