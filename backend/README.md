# 🔧 Backend - API REST Petrolab Cartilla

Backend de la aplicación Petrolab con Node.js + Express + MongoDB

## Stack Técnico

- **Node.js 18+**
- **Express** - Framework web
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **JWT** - Autenticación
- **Bcrypt** - Encriptación de contraseñas
- **Nodemailer** - Envío de emails
- **Express-validator** - Validaciones

## Estructura

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── email.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── cartillaController.js
│   │   ├── catalogoController.js
│   │   └── userController.js
│   ├── middleware/
│   │   ├── auth.js
│   │   ├── errorHandler.js
│   │   └── validator.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Cartilla.js
│   │   ├── PsiGphConfig.js
│   │   └── AuditLog.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── cartillas.js
│   │   ├── catalogos.js
│   │   └── users.js
│   ├── services/
│   │   ├── emailService.js
│   │   └── pdfService.js
│   ├── utils/
│   │   └── helpers.js
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Instalación

1. Navegar a la carpeta backend:
   ```bash
   cd backend
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env
   # Editar .env con tus valores
   ```

4. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

## Variables de Entorno

```env
NODE_ENV=development
PORT=3001
MONGODB_URI=mongodb://localhost:27017/petrolab
JWT_SECRET=tu_secret_key_muy_segura_aqui
JWT_EXPIRE=7d

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña
EMAIL_FROM=noreply@petrolab.cl

FRONTEND_URL=http://localhost:3000
```

## Scripts

```bash
npm run dev      # Desarrollo con nodemon
npm start        # Producción
npm run test     # Tests
npm run seed     # Seed inicial de datos
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Usuario actual
- `PUT /api/auth/password` - Cambiar contraseña

### Cartillas
- `GET /api/cartillas` - Listar cartillas
- `GET /api/cartillas/:id` - Ver cartilla
- `POST /api/cartillas` - Crear cartilla
- `PUT /api/cartillas/:id` - Actualizar cartilla
- `DELETE /api/cartillas/:id` - Eliminar cartilla
- `POST /api/cartillas/:id/enviar-revision` - Enviar a revisión
- `POST /api/cartillas/:id/aprobar` - Aprobar
- `POST /api/cartillas/:id/rechazar` - Rechazar

### Catálogos
- `GET /api/catalogos/psi-gph` - Obtener tabla PSI→GPH
- `PUT /api/catalogos/psi-gph` - Actualizar tabla

### Usuarios (Admin)
- `GET /api/users` - Listar usuarios
- `POST /api/users` - Crear usuario
- `PUT /api/users/:id` - Actualizar usuario
- `DELETE /api/users/:id` - Eliminar usuario

## Despliegue

### MongoDB Atlas (Recomendado)

1. Crear cuenta en https://www.mongodb.com/cloud/atlas
2. Crear cluster gratuito
3. Obtener connection string
4. Actualizar MONGODB_URI en .env

### Railway/Render

1. Conectar repositorio
2. Configurar variables de entorno
3. Deploy automático

---

**Nota**: Este backend está listo para conectarse con el frontend React ya desarrollado.
