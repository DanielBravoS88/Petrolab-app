const mongoose = require('mongoose')

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    
    console.log(`✅ MongoDB conectado: ${conn.connection.host}`)
    
    // Seed inicial si es necesario
    await seedInitialData()
    
  } catch (error) {
    console.error(`❌ Error de conexión MongoDB: ${error.message}`)
    process.exit(1)
  }
}

// Seed de datos iniciales
async function seedInitialData() {
  const PsiGphConfig = require('../models/PsiGphConfig')
  
  const count = await PsiGphConfig.countDocuments()
  if (count === 0) {
    console.log('📊 Creando tabla PSI→GPH inicial...')
    
    const tablaPSIGPH = [
      { psi: 16, gph: 3.8 }, { psi: 17, gph: 3.9 }, { psi: 18, gph: 4.0 },
      { psi: 19, gph: 4.1 }, { psi: 20, gph: 4.3 }, { psi: 21, gph: 4.4 },
      { psi: 22, gph: 4.5 }, { psi: 23, gph: 4.6 }, { psi: 24, gph: 4.7 },
      { psi: 25, gph: 4.7 }, { psi: 26, gph: 4.8 }, { psi: 27, gph: 4.9 },
      { psi: 28, gph: 5.0 }, { psi: 29, gph: 5.1 }, { psi: 30, gph: 5.2 },
      { psi: 31, gph: 5.3 }, { psi: 32, gph: 5.4 }, { psi: 33, gph: 5.5 },
      { psi: 34, gph: 5.5 }, { psi: 35, gph: 5.6 }, { psi: 36, gph: 5.7 },
      { psi: 37, gph: 5.8 }, { psi: 38, gph: 5.9 }, { psi: 39, gph: 5.9 },
      { psi: 40, gph: 6.0 }, { psi: 41, gph: 6.1 }, { psi: 42, gph: 6.2 },
      { psi: 43, gph: 6.2 }, { psi: 44, gph: 6.3 }, { psi: 45, gph: 6.4 },
      { psi: 46, gph: 6.4 }, { psi: 47, gph: 6.5 }, { psi: 48, gph: 6.6 }
    ]
    
    await PsiGphConfig.create({ tabla: tablaPSIGPH })
    console.log('✅ Tabla PSI→GPH creada')
  }
}

module.exports = connectDB
