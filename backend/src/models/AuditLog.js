const mongoose = require('mongoose')

const auditLogSchema = new mongoose.Schema({
  entity: {
    type: String,
    required: true,
    enum: ['User', 'Cartilla', 'PsiGphConfig']
  },
  entityId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['CREATE', 'UPDATE', 'DELETE', 'APPROVE', 'REJECT', 'SEND_REVIEW']
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  changes: {
    type: mongoose.Schema.Types.Mixed
  },
  ipAddress: String,
  userAgent: String
}, {
  timestamps: true
})

// Índices
auditLogSchema.index({ entity: 1, entityId: 1 })
auditLogSchema.index({ userId: 1 })
auditLogSchema.index({ createdAt: -1 })

module.exports = mongoose.model('AuditLog', auditLogSchema)
