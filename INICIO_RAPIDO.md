# 🚀 Guía de Inicio Rápido - Petrolab Cartilla

## 📋 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- **Node.js 18+** - [Descargar aquí](https://nodejs.org/)
- **MongoDB** (local o cuenta en MongoDB Atlas)
- **Git** (opcional)

## 🎯 PASO 1: Instalar el Frontend

1. Abre PowerShell y navega a la carpeta del proyecto:
   ```powershell
   cd C:\Workspace2\Petrolab-app
   ```

2. Instala las dependencias:
   ```powershell
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```powershell
   npm run dev
   ```

4. Abre tu navegador en: `http://localhost:3000`

### Credenciales de Prueba (Frontend Mock):
- **Inspector**: inspector@petrolab.cl / petrolab123
- **Supervisor**: supervisor@petrolab.cl / petrolab123
- **Admin**: admin@petrolab.cl / petrolab123

## 🔧 PASO 2: Configurar el Backend (Opcional - Fase 2)

### Opción A: MongoDB Local

1. Instala MongoDB Community: https://www.mongodb.com/try/download/community

2. Navega a la carpeta backend:
   ```powershell
   cd C:\Workspace2\Petrolab-app\backend
   ```

3. Instala dependencias:
   ```powershell
   npm install
   ```

4. Crea el archivo `.env` (copia de `.env.example`):
   ```powershell
   Copy-Item .env.example .env
   ```

5. Edita el archivo `.env` y configura:
   ```env
   NODE_ENV=development
   PORT=3001
   MONGODB_URI=mongodb://localhost:27017/petrolab
   JWT_SECRET=tu_secret_key_muy_segura_aqui
   ```

6. Inicia el servidor backend:
   ```powershell
   npm run dev
   ```

### Opción B: MongoDB Atlas (Cloud - Recomendado)

1. Crea una cuenta gratuita en: https://www.mongodb.com/cloud/atlas

2. Crea un cluster gratuito (M0)

3. En "Database Access", crea un usuario con contraseña

4. En "Network Access", agrega tu IP (o 0.0.0.0/0 para desarrollo)

5. Obtén tu connection string (Connect → Drivers)

6. Edita `.env` y configura:
   ```env
   MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/petrolab?retryWrites=true&w=majority
   ```

7. Inicia el servidor:
   ```powershell
   npm run dev
   ```

## 🔗 PASO 3: Conectar Frontend con Backend

Una vez que el backend esté corriendo, actualiza el frontend:

1. Abre `src/context/AuthContext.jsx`

2. Reemplaza las funciones mock con llamadas reales al API:

```javascript
const login = async (email, password) => {
  const response = await fetch('http://localhost:3001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  
  const data = await response.json()
  
  if (data.success) {
    setUser(data.data)
    localStorage.setItem('petrolab_token', data.token)
    localStorage.setItem('petrolab_user', JSON.stringify(data.data))
    return { success: true, user: data.data }
  }
  
  return { success: false, error: data.message }
}
```

## 📱 Uso de la Aplicación

### Crear una Nueva Cartilla:

1. Inicia sesión con cualquier usuario
2. Haz clic en "Nueva Cartilla"
3. Completa el wizard de 4 pasos:
   - **Paso 1**: Datos de instalación y mandante
   - **Paso 2**: Agregar líneas y tanques
   - **Paso 3**: Registrar pruebas (cálculo automático PSI→GPH)
   - **Paso 4**: Firmas digitales
4. Guarda como borrador o envía a revisión

### Exportar PDF:

1. Abre cualquier cartilla desde el Dashboard
2. Haz clic en "Exportar PDF"
3. El PDF se descargará automáticamente

## 🐛 Solución de Problemas

### Error de Puerto en Uso:

Si el puerto 3000 ya está en uso, edita `vite.config.js`:
```javascript
server: {
  port: 3002, // Cambia el puerto
  open: true
}
```

### Error de MongoDB:

- Verifica que MongoDB esté corriendo: `mongosh` en PowerShell
- Revisa el MONGODB_URI en `.env`
- Asegúrate de tener permisos en el directorio de datos

### Error de CORS:

Si ves errores de CORS, verifica que FRONTEND_URL en backend `.env` coincida con la URL del frontend.

## 📚 Recursos Adicionales

- **Documentación React**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Express Guide**: https://expressjs.com/
- **MongoDB Docs**: https://www.mongodb.com/docs/

## 🆘 Soporte

Si encuentras problemas:

1. Revisa los logs de la consola
2. Verifica que todas las dependencias estén instaladas
3. Asegúrate de estar en las carpetas correctas
4. Revisa los archivos `.env`

## 🎉 ¡Listo!

Tu aplicación Petrolab está configurada y lista para usar. 

### URLs:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001/api
- **Health Check**: http://localhost:3001/health

---

**Nota**: El frontend funciona de forma independiente con datos mock. El backend es opcional para la Fase 2.
