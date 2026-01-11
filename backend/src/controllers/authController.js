const User = require('../models/User')
const jwt = require('jsonwebtoken')

// Generar JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  })
}

// @desc    Registrar usuario
// @route   POST /api/auth/register
// @access  Public (o Admin para crear usuarios)
exports.register = async (req, res, next) => {
  try {
    const { nombre, email, password, rol } = req.body
    
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado'
      })
    }
    
    // Crear usuario
    const user = await User.create({
      nombre,
      email,
      password,
      rol: rol || 'OPERADOR'
    })
    
    const token = generateToken(user._id)
    
    res.status(201).json({
      success: true,
      data: user,
      token
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login de usuario
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email y contraseña son requeridos'
      })
    }
    
    // Buscar usuario con password
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }
    
    // Verificar contraseña
    const isMatch = await user.comparePassword(password)
    
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      })
    }
    
    if (!user.activo) {
      return res.status(401).json({
        success: false,
        message: 'Usuario inactivo'
      })
    }
    
    // Actualizar último acceso
    user.ultimoAcceso = new Date()
    await user.save()
    
    const token = generateToken(user._id)
    
    res.json({
      success: true,
      data: user.toJSON(),
      token
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Obtener usuario actual
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
    
    res.json({
      success: true,
      data: user
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cambiar contraseña
// @route   PUT /api/auth/password
// @access  Private
exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body
    
    const user = await User.findById(req.user.id).select('+password')
    
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Contraseña actual incorrecta'
      })
    }
    
    user.password = newPassword
    await user.save()
    
    res.json({
      success: true,
      message: 'Contraseña actualizada exitosamente'
    })
  } catch (error) {
    next(error)
  }
}
