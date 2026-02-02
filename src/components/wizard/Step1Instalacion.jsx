import { FormField } from '../UIComponents'
import { TIPOS_MANDANTE, REGIONES_CHILE } from '../../config/catalogs'

function Step1Instalacion({ formData, updateFormData }) {
  // Función para formatear RUT automáticamente
  const formatearRUT = (value) => {
    // Eliminar todo excepto números y k/K
    let rut = value.replace(/[^\dkK]/g, '')
    
    if (rut.length === 0) return ''
    
    // Separar el dígito verificador
    let dv = rut.slice(-1).toUpperCase()
    let numero = rut.slice(0, -1)
    
    // Si solo hay un caracter, no formatear
    if (numero.length === 0) return rut
    
    // Formatear con puntos
    numero = numero.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
    
    return `${numero}-${dv}`
  }

  // Función para formatear teléfono chileno automáticamente
  const formatearTelefono = (value) => {
    // Eliminar todo excepto números y el símbolo +
    let telefono = value.replace(/[^\d+]/g, '')
    
    if (telefono.length === 0) return ''
    
    // Si no empieza con +, agregar +56
    if (!telefono.startsWith('+')) {
      telefono = '+56' + telefono
    }
    
    // Extraer las partes
    let formatted = telefono.replace(/^\+(\d{2})(\d{0,1})(\d{0,4})(\d{0,4}).*/, (match, p1, p2, p3, p4) => {
      let result = `+${p1}`
      if (p2) result += ` ${p2}`
      if (p3) result += ` ${p3}`
      if (p4) result += ` ${p4}`
      return result.trim()
    })
    
    return formatted
  }

  const handleRUTChange = (value) => {
    const rutFormateado = formatearRUT(value)
    handleInstalacionChange('rut', rutFormateado)
  }

  const handleTelefonoChange = (value) => {
    const telefonoFormateado = formatearTelefono(value)
    handleInstalacionChange('telefono', telefonoFormateado)
  }

  const handleInstalacionChange = (field, value) => {
    updateFormData({
      instalacion: {
        ...formData.instalacion,
        [field]: value
      }
    })
  }

  const handleMandanteChange = (field, value) => {
    updateFormData({
      mandante: {
        ...formData.mandante,
        [field]: value
      }
    })
  }

  return (
    <div className="space-y-8">
      <h2 className="section-title">Paso 1: Instalación y Mandante</h2>

      {/* UOM y Fecha */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField label="Número UOM" required>
          <input
            type="text"
            className="input-petrolab"
            placeholder="001"
            value={formData.uomNumero}
            onChange={(e) => updateFormData({ uomNumero: e.target.value })}
          />
        </FormField>

        <FormField label="Fecha de Prueba" required>
          <input
            type="date"
            className="input-petrolab"
            value={formData.fechaPrueba}
            onChange={(e) => updateFormData({ fechaPrueba: e.target.value })}
          />
        </FormField>

        <FormField label="Hora de Inicio">
          <input
            type="time"
            className="input-petrolab"
            value={formData.horaInicio}
            onChange={(e) => updateFormData({ horaInicio: e.target.value })}
          />
        </FormField>
      </div>

      {/* Datos de Instalación */}
      <div>
        <h3 className="text-lg font-bold text-petrolab-blue-700 mb-4">Datos de Instalación</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="RUT" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="96.810.370-9"
              value={formData.instalacion.rut}
              onChange={(e) => handleRUTChange(e.target.value)}
              maxLength="12"
            />
          </FormField>

          <FormField label="Nombre del Sitio/Estación" required>
            <input
              type="text"
              className="input-petrolab"
              placeholder="Estación Shell Providencia"
              value={formData.instalacion.nombreSitio}
              onChange={(e) => handleInstalacionChange('nombreSitio', e.target.value)}
            />
          </FormField>

          <FormField label="Compañía">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Shell Chile"
              value={formData.instalacion.compania}
              onChange={(e) => handleInstalacionChange('compania', e.target.value)}
            />
          </FormField>

          <FormField label="Código">
            <input
              type="text"
              className="input-petrolab"
              placeholder="SH-001"
              value={formData.instalacion.codigo}
              onChange={(e) => handleInstalacionChange('codigo', e.target.value)}
            />
          </FormField>

          <FormField label="Contacto">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Juan Pérez"
              value={formData.instalacion.contacto}
              onChange={(e) => handleInstalacionChange('contacto', e.target.value)}
            />
          </FormField>

          <FormField label="Teléfono">
            <input
              type="tel"
              className="input-petrolab"
              placeholder="+56 9 1234 5678"
              value={formData.instalacion.telefono}
              onChange={(e) => handleTelefonoChange(e.target.value)}
              maxLength="17"
            />
          </FormField>

          <FormField label="Dirección" className="md:col-span-2">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Av. Providencia 1234"
              value={formData.instalacion.direccion}
              onChange={(e) => handleInstalacionChange('direccion', e.target.value)}
            />
          </FormField>

          <FormField label="Comuna">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Providencia"
              value={formData.instalacion.comuna}
              onChange={(e) => handleInstalacionChange('comuna', e.target.value)}
            />
          </FormField>

          <FormField label="Ciudad">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Santiago"
              value={formData.instalacion.ciudad}
              onChange={(e) => handleInstalacionChange('ciudad', e.target.value)}
            />
          </FormField>

          <FormField label="Región">
            <select
              className="select-petrolab"
              value={formData.instalacion.region}
              onChange={(e) => handleInstalacionChange('region', e.target.value)}
            >
              <option value="">Seleccione región...</option>
              {REGIONES_CHILE.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Representante Legal">
            <input
              type="text"
              className="input-petrolab"
              placeholder="Carlos González"
              value={formData.instalacion.repLegal}
              onChange={(e) => handleInstalacionChange('repLegal', e.target.value)}
            />
          </FormField>
        </div>
      </div>

      {/* Datos de Mandante */}
      <div>
        <h3 className="text-lg font-bold text-petrolab-blue-700 mb-4">Datos de Mandante</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Tipo de Mandante">
            <select
              className="select-petrolab"
              value={formData.mandante.tipo}
              onChange={(e) => handleMandanteChange('tipo', e.target.value)}
            >
              {TIPOS_MANDANTE.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>
          </FormField>

          <FormField label="Código de Estación">
            <input
              type="text"
              className="input-petrolab"
              placeholder="641"
              value={formData.mandante.fileNumero}
              onChange={(e) => handleMandanteChange('fileNumero', e.target.value)}
            />
          </FormField>

          <FormField label="Nombre Legal">
            <input
              type="text"
              className="input-petrolab"
              placeholder="ENEX"
              value={formData.mandante.nombreLegal}
              onChange={(e) => handleMandanteChange('nombreLegal', e.target.value)}
            />
          </FormField>

          <FormField label="Descripción">
            <input
              type="text"
              className="input-petrolab"
              placeholder="ENEX Retail"
              value={formData.mandante.descripcion}
              onChange={(e) => handleMandanteChange('descripcion', e.target.value)}
            />
          </FormField>
        </div>
      </div>
    </div>
  )
}

export default Step1Instalacion
