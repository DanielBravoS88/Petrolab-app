const Cartilla = require('../models/Cartilla')

// @desc    Obtener todas las cartillas
// @route   GET /api/cartillas
// @access  Private
exports.getCartillas = async (req, res, next) => {
  try {
    const { estado, fechaDesde, fechaHasta, page = 1, limit = 20 } = req.query
    
    let query = {}
    
    // Filtrar por rol
    if (req.user.rol === 'OPERADOR') {
      query.createdBy = req.user._id
    }
    
    // Filtros opcionales
    if (estado) {
      query.estado = estado
    }
    
    if (fechaDesde || fechaHasta) {
      query.fechaPrueba = {}
      if (fechaDesde) query.fechaPrueba.$gte = new Date(fechaDesde)
      if (fechaHasta) query.fechaPrueba.$lte = new Date(fechaHasta)
    }
    
    const skip = (parseInt(page) - 1) * parseInt(limit)
    
    const cartillas = await Cartilla.find(query)
      .populate('createdBy', 'nombre email')
      .populate('updatedBy', 'nombre email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
    
    const total = await Cartilla.countDocuments(query)
    
    res.json({
      success: true,
      data: cartillas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener una cartilla por ID
// @route   GET /api/cartillas/:id
// @access  Private
exports.getCartilla = async (req, res, next) => {
  try {
    const cartilla = await Cartilla.findById(req.params.id)
      .populate('createdBy', 'nombre email rol')
      .populate('updatedBy', 'nombre email rol')
      .populate('comentariosRevision.usuario', 'nombre email')
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    // Verificar permisos
    if (req.user.rol === 'OPERADOR' && cartilla.createdBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para ver esta cartilla'
      })
    }
    
    res.json({
      success: true,
      data: cartilla
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Crear nueva cartilla
// @route   POST /api/cartillas
// @access  Private
exports.createCartilla = async (req, res, next) => {
  try {
    req.body.createdBy = req.user._id
    
    const cartilla = await Cartilla.create(req.body)
    
    res.status(201).json({
      success: true,
      data: cartilla
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Actualizar cartilla
// @route   PUT /api/cartillas/:id
// @access  Private
exports.updateCartilla = async (req, res, next) => {
  try {
    let cartilla = await Cartilla.findById(req.params.id)
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    // Solo el creador o admin pueden editar
    if (req.user.rol !== 'ADMIN' && cartilla.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No autorizado para editar esta cartilla'
      })
    }
    
    // Solo se puede editar en estado BORRADOR
    if (cartilla.estado !== 'BORRADOR' && req.user.rol !== 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden editar cartillas en borrador'
      })
    }
    
    req.body.updatedBy = req.user._id
    
    cartilla = await Cartilla.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
    
    res.json({
      success: true,
      data: cartilla
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Eliminar cartilla
// @route   DELETE /api/cartillas/:id
// @access  Private (Admin o creador solo si está en borrador)
exports.deleteCartilla = async (req, res, next) => {
  try {
    const cartilla = await Cartilla.findById(req.params.id)
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    // Solo admin o creador en borrador pueden eliminar
    if (req.user.rol !== 'ADMIN') {
      if (cartilla.createdBy.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'No autorizado'
        })
      }
      
      if (cartilla.estado !== 'BORRADOR') {
        return res.status(400).json({
          success: false,
          message: 'Solo se pueden eliminar cartillas en borrador'
        })
      }
    }
    
    await cartilla.remove()
    
    res.json({
      success: true,
      data: {}
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Enviar cartilla a revisión
// @route   POST /api/cartillas/:id/enviar-revision
// @access  Private
exports.enviarRevision = async (req, res, next) => {
  try {
    const cartilla = await Cartilla.findById(req.params.id)
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    if (cartilla.estado !== 'BORRADOR') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden enviar a revisión cartillas en borrador'
      })
    }
    
    cartilla.estado = 'EN_REVISION'
    cartilla.updatedBy = req.user._id
    await cartilla.save()
    
    // TODO: Enviar email a supervisores
    
    res.json({
      success: true,
      data: cartilla,
      message: 'Cartilla enviada a revisión'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Aprobar cartilla
// @route   POST /api/cartillas/:id/aprobar
// @access  Private (Supervisor/Admin)
exports.aprobarCartilla = async (req, res, next) => {
  try {
    const { comentario } = req.body
    
    const cartilla = await Cartilla.findById(req.params.id)
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    if (cartilla.estado !== 'EN_REVISION') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden aprobar cartillas en revisión'
      })
    }
    
    cartilla.estado = 'APROBADA'
    cartilla.updatedBy = req.user._id
    
    if (comentario) {
      cartilla.comentariosRevision.push({
        usuario: req.user._id,
        comentario
      })
    }
    
    await cartilla.save()
    
    res.json({
      success: true,
      data: cartilla,
      message: 'Cartilla aprobada'
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Rechazar cartilla
// @route   POST /api/cartillas/:id/rechazar
// @access  Private (Supervisor/Admin)
exports.rechazarCartilla = async (req, res, next) => {
  try {
    const { comentario } = req.body
    
    if (!comentario) {
      return res.status(400).json({
        success: false,
        message: 'El comentario es requerido al rechazar'
      })
    }
    
    const cartilla = await Cartilla.findById(req.params.id)
    
    if (!cartilla) {
      return res.status(404).json({
        success: false,
        message: 'Cartilla no encontrada'
      })
    }
    
    if (cartilla.estado !== 'EN_REVISION') {
      return res.status(400).json({
        success: false,
        message: 'Solo se pueden rechazar cartillas en revisión'
      })
    }
    
    cartilla.estado = 'RECHAZADA'
    cartilla.updatedBy = req.user._id
    cartilla.comentariosRevision.push({
      usuario: req.user._id,
      comentario
    })
    
    await cartilla.save()
    
    res.json({
      success: true,
      data: cartilla,
      message: 'Cartilla rechazada'
    })
  } catch (error) {
    next(error)
  }
}
