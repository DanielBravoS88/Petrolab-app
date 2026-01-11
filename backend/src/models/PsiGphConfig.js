const mongoose = require('mongoose')

const psiGphConfigSchema = new mongoose.Schema({
  tabla: [{
    psi: { type: Number, required: true },
    gph: { type: Number, required: true }
  }],
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
})

module.exports = mongoose.model('PsiGphConfig', psiGphConfigSchema)
