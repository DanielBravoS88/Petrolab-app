const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const { auditAction } = require('../middleware/errorHandler')
const {
  getCartillas,
  getCartilla,
  createCartilla,
  updateCartilla,
  deleteCartilla,
  enviarRevision,
  aprobarCartilla,
  rechazarCartilla
} = require('../controllers/cartillaController')

// Rutas públicas para todos los usuarios autenticados
router.use(protect)

router.route('/')
  .get(getCartillas)
  .post(auditAction('Cartilla', 'CREATE'), createCartilla)

router.route('/:id')
  .get(getCartilla)
  .put(auditAction('Cartilla', 'UPDATE'), updateCartilla)
  .delete(auditAction('Cartilla', 'DELETE'), deleteCartilla)

// Acciones de workflow
router.post('/:id/enviar-revision', auditAction('Cartilla', 'SEND_REVIEW'), enviarRevision)

router.post('/:id/aprobar', 
  authorize('SUPERVISOR', 'ADMIN'),
  auditAction('Cartilla', 'APPROVE'),
  aprobarCartilla
)

router.post('/:id/rechazar',
  authorize('SUPERVISOR', 'ADMIN'),
  auditAction('Cartilla', 'REJECT'),
  rechazarCartilla
)

module.exports = router
