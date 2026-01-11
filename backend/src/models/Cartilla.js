const mongoose = require('mongoose')

const lineaDetalleSchema = new mongoose.Schema({
  numeroLinea: { type: String, required: true },
  numeroEstanque: { type: String, required: true },
  capacidadLitros: { type: Number },
  numeroSerieEstanque: { type: String },
  bocas: { type: String },
  tipoLinea: { type: String },
  diametroPulgadas: { type: String },
  producto: { type: String },
  equipoInspeccion: { type: String },
  presionInicial: { type: Number },
  presion5min: { type: Number },
  presion25min: { type: Number },
  funcionalidadDetector: { type: String },
  resultadoHermeticidad: { 
    type: String,
    enum: ['PASA', 'NO_PASA']
  }
}, { _id: false })

const pruebaDetalleSchema = new mongoose.Schema({
  numeroLinea: { type: String, required: true },
  numeroEstanque: { type: String, required: true },
  capacidadLitros: { type: Number },
  producto: { type: String },
  bombaSumergibleMarca: { type: String },
  detectorMarca: { type: String },
  detectorModelo: { type: String },
  detectorTipo: { 
    type: String,
    enum: ['MECANICO', 'ELECTRONICO']
  },
  presionOperacionPSI: { type: Number, required: true },
  presionVerificacionPSI: { type: Number },
  presionDetencionPSI: { type: Number },
  presionPruebaPSI: { type: Number },
  flujoFugaGPH: { type: Number, required: true },
  resultado: { 
    type: String,
    enum: ['PASA', 'NO_PASA'],
    required: true
  },
  observacion: { type: String }
}, { _id: false })

const cartillaSchema = new mongoose.Schema({
  uomNumero: {
    type: String,
    required: [true, 'El número UOM es requerido'],
    unique: true
  },
  
  // Instalación
  instalacion: {
    rut: { type: String, required: true },
    nombreSitio: { type: String, required: true },
    compania: { type: String },
    codigo: { type: String },
    contacto: { type: String },
    direccion: { type: String },
    comuna: { type: String },
    ciudad: { type: String },
    region: { type: String },
    telefono: { type: String },
    repLegal: { type: String }
  },
  
  // Mandante
  mandante: {
    tipo: { type: String },
    fileNumero: { type: String },
    nombreLegal: { type: String },
    descripcion: { type: String }
  },
  
  // Datos de prueba
  fechaPrueba: {
    type: Date,
    required: [true, 'La fecha de prueba es requerida']
  },
  horaInicio: { type: String },
  horaTermino: { type: String },
  inspectorNombre: { type: String, required: true },
  ayudanteNombre: { type: String },
  administradorNombre: { type: String },
  
  // Líneas y pruebas
  lineas: [lineaDetalleSchema],
  pruebas: [pruebaDetalleSchema],
  
  // Firmas (base64)
  firmaAdministrador: { type: String },
  firmaInspector: { type: String },
  
  // Estado
  estado: {
    type: String,
    enum: ['BORRADOR', 'EN_REVISION', 'APROBADA', 'RECHAZADA'],
    default: 'BORRADOR'
  },
  
  // Comentarios de revisión
  comentariosRevision: [{
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    comentario: { type: String },
    fecha: { type: Date, default: Date.now }
  }],
  
  // Auditoría
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

// Índices para búsquedas
cartillaSchema.index({ uomNumero: 1 })
cartillaSchema.index({ estado: 1 })
cartillaSchema.index({ fechaPrueba: -1 })
cartillaSchema.index({ createdBy: 1 })

module.exports = mongoose.model('Cartilla', cartillaSchema)
