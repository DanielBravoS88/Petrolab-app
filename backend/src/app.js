require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const rateLimit = require('express-rate-limit')

const connectDB = require('./config/database')
const { errorHandler } = require('./middleware/errorHandler')

// Conectar a MongoDB
connectDB()

const app = express()

// Middleware de seguridad
app.use(helmet())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}))

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 requests por windowMs
})
app.use('/api/', limiter)

// Body parser
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Compression
app.use(compression())

// Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
})

// Routes
app.use('/api/auth', require('./routes/auth'))
app.use('/api/cartillas', require('./routes/cartillas'))
app.use('/api/catalogos', require('./routes/catalogos'))

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  })
})

// Error handler (debe ser el último middleware)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║                                            ║
║   🚀 PETROLAB API Server                   ║
║                                            ║
║   📡 Puerto: ${PORT}                       ║
║   🌍 Entorno: ${process.env.NODE_ENV || 'development'}              ║
║   📋 API: http://localhost:${PORT}/api      ║
║                                            ║
╚════════════════════════════════════════════╝
  `)
})

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
  console.error(`❌ Error no manejado: ${err.message}`)
  server.close(() => process.exit(1))
})

module.exports = app
