const express = require('express')
const router = express.Router()
const { protect, authorize } = require('../middleware/auth')
const {
  getPsiGphTable,
  updatePsiGphTable
} = require('../controllers/catalogoController')

router.use(protect)

router.route('/psi-gph')
  .get(getPsiGphTable)
  .put(authorize('ADMIN'), updatePsiGphTable)

module.exports = router
