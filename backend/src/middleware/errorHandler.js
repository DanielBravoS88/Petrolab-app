const AuditLog = require('../models/AuditLog')

const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err)
  
  let error = { ...err }
  error.message = err.message
  
  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Recurso no encontrado'
    error.statusCode = 404
  }
  
  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Valor duplicado ingresado'
    error.statusCode = 400
  }
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(val => val.message)
    error.message = messages.join(', ')
    error.statusCode = 400
  }
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Error del servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
}

// Middleware para registrar acciones en audit log
const auditAction = (entity, action) => {
  return async (req, res, next) => {
    // Guardar el json original para comparar después
    const originalJson = res.json.bind(res)
    
    res.json = async function(data) {
      if (data.success && req.user) {
        try {
          await AuditLog.create({
            entity,
            entityId: data.data?._id || req.params.id,
            action,
            userId: req.user._id,
            changes: req.body,
            ipAddress: req.ip,
            userAgent: req.get('user-agent')
          })
        } catch (error) {
          console.error('Error al crear audit log:', error)
        }
      }
      
      return originalJson(data)
    }
    
    next()
  }
}

module.exports = { errorHandler, auditAction }
