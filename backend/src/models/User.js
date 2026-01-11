const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es requerida'],
    minlength: 6,
    select: false // No devolver en consultas por defecto
  },
  rol: {
    type: String,
    enum: ['OPERADOR', 'SUPERVISOR', 'ADMIN'],
    default: 'OPERADOR'
  },
  activo: {
    type: Boolean,
    default: true
  },
  ultimoAcceso: {
    type: Date
  }
}, {
  timestamps: true
})

// Hash password antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next()
  }
  
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
  next()
})

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Método para obtener usuario sin password
userSchema.methods.toJSON = function() {
  const user = this.toObject()
  delete user.password
  return user
}

module.exports = mongoose.model('User', userSchema)
