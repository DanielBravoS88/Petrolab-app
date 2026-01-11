import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Card, Alert } from '../components/UIComponents'
import Step1Instalacion from '../components/wizard/Step1Instalacion'
import Step2Lineas from '../components/wizard/Step2Lineas'
import Step3Pruebas from '../components/wizard/Step3Pruebas'
import Step4Firmas from '../components/wizard/Step4Firmas'
import { ESTADOS_CARTILLA } from '../config/catalogs'

const STEPS = [
  { id: 1, nombre: 'Instalación y Mandante', component: Step1Instalacion },
  { id: 2, nombre: 'Líneas y Tanques', component: Step2Lineas },
  { id: 3, nombre: 'Pruebas de Detector', component: Step3Pruebas },
  { id: 4, nombre: 'Firmas y Finalizar', component: Step4Firmas }
]

function NuevaCartilla() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [currentStep, setCurrentStep] = useState(1)
  const [alert, setAlert] = useState(null)
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    // Cabecera
    uomNumero: '',
    estado: ESTADOS_CARTILLA.BORRADOR,
    
    // Instalación
    instalacion: {
      rut: '',
      nombreSitio: '',
      compania: '',
      codigo: '',
      contacto: '',
      direccion: '',
      comuna: '',
      ciudad: '',
      region: '',
      telefono: '',
      repLegal: ''
    },
    
    // Mandante
    mandante: {
      tipo: 'DF',
      fileNumero: '',
      nombreLegal: '',
      descripcion: ''
    },
    
    // Datos de prueba
    fechaPrueba: new Date().toISOString().split('T')[0],
    horaInicio: '',
    horaTermino: '',
    inspectorNombre: user?.nombre || '',
    ayudanteNombre: '',
    administradorNombre: '',
    
    // Líneas (tabla superior)
    lineas: [],
    
    // Pruebas (tabla de prueba detector)
    pruebas: [],
    
    // Firmas
    firmaAdministrador: '',
    firmaInspector: '',
    
    // Auditoría
    createdBy: user?.id,
    createdAt: new Date().toISOString()
  })

  const updateFormData = (updates) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }))
  }

  const handleNext = () => {
    // Validar paso actual
    const validation = validateStep(currentStep)
    if (!validation.valid) {
      setAlert({ type: 'error', message: validation.message })
      return
    }
    
    setAlert(null)
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleSaveDraft = () => {
    try {
      // Guardar en localStorage
      const cartillas = JSON.parse(localStorage.getItem('petrolab_cartillas') || '[]')
      
      const newCartilla = {
        ...formData,
        id: Date.now().toString(),
        updatedAt: new Date().toISOString()
      }
      
      cartillas.push(newCartilla)
      localStorage.setItem('petrolab_cartillas', JSON.stringify(cartillas))
      
      setAlert({ type: 'success', message: 'Borrador guardado exitosamente' })
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al guardar borrador' })
    }
  }

  const handleFinalize = () => {
    // Validar todo el formulario
    const validation = validateAllSteps()
    if (!validation.valid) {
      setAlert({ type: 'error', message: validation.message })
      return
    }
    
    try {
      const cartillas = JSON.parse(localStorage.getItem('petrolab_cartillas') || '[]')
      
      const newCartilla = {
        ...formData,
        id: Date.now().toString(),
        estado: ESTADOS_CARTILLA.EN_REVISION,
        updatedAt: new Date().toISOString()
      }
      
      cartillas.push(newCartilla)
      localStorage.setItem('petrolab_cartillas', JSON.stringify(cartillas))
      
      setAlert({ type: 'success', message: 'Cartilla enviada a revisión exitosamente' })
      
      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al finalizar cartilla' })
    }
  }

  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.uomNumero) return { valid: false, message: 'El número UOM es requerido' }
        if (!formData.instalacion.nombreSitio) return { valid: false, message: 'El nombre del sitio es requerido' }
        if (!formData.instalacion.rut) return { valid: false, message: 'El RUT es requerido' }
        if (!formData.fechaPrueba) return { valid: false, message: 'La fecha de prueba es requerida' }
        return { valid: true }
      
      case 2:
        if (formData.lineas.length === 0) return { valid: false, message: 'Debe agregar al menos una línea' }
        return { valid: true }
      
      case 3:
        if (formData.pruebas.length === 0) return { valid: false, message: 'Debe agregar al menos una prueba' }
        return { valid: true }
      
      case 4:
        if (!formData.inspectorNombre) return { valid: false, message: 'El nombre del inspector es requerido' }
        if (!formData.horaInicio) return { valid: false, message: 'La hora de inicio es requerida' }
        if (!formData.horaTermino) return { valid: false, message: 'La hora de término es requerida' }
        return { valid: true }
      
      default:
        return { valid: true }
    }
  }

  const validateAllSteps = () => {
    for (let i = 1; i <= STEPS.length; i++) {
      const validation = validateStep(i)
      if (!validation.valid) {
        return { valid: false, message: `Error en paso ${i}: ${validation.message}` }
      }
    }
    return { valid: true }
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nueva Cartilla de Terreno</h1>
        <p className="text-gray-600">FR024 / PC-113 / PPL 7.1-04</p>
      </div>

      {/* Wizard Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex-1 flex items-center">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm
                    ${currentStep >= step.id
                      ? 'bg-petrolab-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                    }
                  `}
                >
                  {step.id}
                </div>
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
        
        {/* Nombre del paso actual en móvil */}
        <p className="text-center font-semibold text-petrolab-blue-600 md:hidden">
          {STEPS[currentStep - 1].nombre}
        </p>
      </div>

      {/* Alert */}
      {alert && (
        <div className="mb-6">
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        </div>
      )}

      {/* Contenido del paso actual */}
      <Card>
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
        />
      </Card>

      {/* Botones de navegación */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-between">
        <div className="flex gap-3">
          {currentStep > 1 && (
            <button onClick={handlePrevious} className="btn-secondary">
              ← Anterior
            </button>
          )}
        </div>
        
        <div className="flex gap-3">
          <button onClick={handleSaveDraft} className="btn-secondary">
            💾 Guardar Borrador
          </button>
          
          {currentStep < STEPS.length ? (
            <button onClick={handleNext} className="btn-petrolab">
              Siguiente →
            </button>
          ) : (
            <button onClick={handleFinalize} className="btn-petrolab">
              ✓ Finalizar y Enviar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default NuevaCartilla
