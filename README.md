# 📋 Petrolab - Cartilla de Terreno de Líneas

Sistema de digitalización de la Cartilla de Terreno de Líneas (FR024 / PC-113 / PPL 7.1-04) para Petrolab Chile.

## 🚀 Características Principales

### ✅ FASE 1 - Frontend Completo (Implementado)

- **Autenticación de Usuarios**: Sistema de login con roles (Operador, Supervisor, Admin)
- **Wizard Multi-Paso**: Formulario intuitivo dividido en 4 pasos
  1. Instalación y Mandante
  2. Líneas y Tanques (tabla dinámica)
  3. Pruebas de Detector (tabla dinámica con cálculo automático)
  4. Firmas y Finalización
- **Cálculo Automático PSI → GPH**: Conversión automática de presión a flujo de fuga con interpolación lineal
- **Tablas Dinámicas**: Agregar, editar y eliminar líneas y pruebas
- **Captura de Firmas**: Firma digital para administrador e inspector
- **Exportar PDF**: Generación de reporte en PDF con formato profesional
- **Responsive Design**: Optimizado para tablet, celular y PC
- **Autoguardado**: Persistencia local en localStorage
- **Dashboard**: Vista de todas las cartillas con filtros por estado
- **Estados**: BORRADOR, EN_REVISION, APROBADA, RECHAZADA

### 🎨 Diseño

- **Paleta Petrolab**: Azul (#0066cc) y blanco
- **UI Touch-Friendly**: Botones y campos grandes para uso en tablet
- **Tailwind CSS**: Estilos modernos y responsivos

## 📁 Estructura del Proyecto

```
Petrolab-app/
├── public/
│   └── petrolab-icon.svg
├── src/
│   ├── components/
│   │   ├── wizard/
│   │   │   ├── Step1Instalacion.jsx
│   │   │   ├── Step2Lineas.jsx
│   │   │   ├── Step3Pruebas.jsx
│   │   │   └── Step4Firmas.jsx
│   │   ├── Layout.jsx
│   │   └── UIComponents.jsx
│   ├── config/
│   │   ├── catalogs.js          # Catálogos de datos
│   │   └── psiGphTable.js       # Tabla PSI→GPH y lógica de cálculo
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── NuevaCartilla.jsx
│   │   ├── EditarCartilla.jsx
│   │   ├── VerCartilla.jsx
│   │   └── AdminPanel.jsx
│   ├── utils/
│   │   └── pdfExport.js         # Generación de PDF
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## 🛠️ Tecnologías

- **React 18** - Framework UI
- **Vite** - Build tool
- **React Router** - Navegación
- **Tailwind CSS** - Estilos
- **jsPDF + autotable** - Generación de PDF
- **react-signature-canvas** - Captura de firmas
- **date-fns** - Manejo de fechas

## 🚦 Instalación y Uso

### Prerrequisitos

- Node.js 18+ 
- npm o yarn

### Pasos

1. **Instalar dependencias**
   ```bash
   cd Petrolab-app
   npm install
   ```

2. **Iniciar servidor de desarrollo**
   ```bash
   npm run dev
   ```

3. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

### Credenciales de Prueba

- **Inspector**: inspector@petrolab.cl / petrolab123
- **Supervisor**: supervisor@petrolab.cl / petrolab123  
- **Admin**: admin@petrolab.cl / petrolab123

## 📊 Modelo de Datos

### Cartilla

```javascript
{
  id: string,
  uomNumero: string,
  estado: 'BORRADOR' | 'EN_REVISION' | 'APROBADA' | 'RECHAZADA',
  
  instalacion: {
    rut, nombreSitio, compania, codigo, contacto,
    direccion, comuna, ciudad, region, telefono, repLegal
  },
  
  mandante: {
    tipo, fileNumero, nombreLegal, descripcion
  },
  
  fechaPrueba: string,
  horaInicio: string,
  horaTermino: string,
  inspectorNombre: string,
  ayudanteNombre: string,
  administradorNombre: string,
  
  lineas: [
    {
      numeroLinea, numeroEstanque, capacidadLitros,
      numeroSerieEstanque, bocas, tipoLinea,
      diametroPulgadas, producto, equipoInspeccion, ...
    }
  ],
  
  pruebas: [
    {
      numeroLinea, numeroEstanque, producto,
      bombaSumergibleMarca, detectorMarca, detectorModelo,
      detectorTipo, presionOperacionPSI, flujoFugaGPH,
      resultado: 'PASA' | 'NO_PASA', observacion, ...
    }
  ],
  
  firmaAdministrador: string (base64),
  firmaInspector: string (base64),
  
  createdBy: string,
  createdAt: string,
  updatedBy: string,
  updatedAt: string
}
```

## 🧮 Tabla PSI → GPH

Conversión automática de Presión de Operación (PSI) a Flujo de Fuga (GPH):

- **Rango**: 16-48 PSI
- **Método**: 
  - Valor exacto si existe en tabla
  - Interpolación lineal entre valores
  - Valor más cercano si está fuera de rango

Ejemplo:
```
30 PSI → 5.2 GPH (exacto)
30.5 PSI → 5.25 GPH (interpolado)
```

## 🔄 Flujo de Trabajo

1. **Login**: Usuario inicia sesión con sus credenciales
2. **Dashboard**: Ve sus cartillas existentes
3. **Nueva Cartilla**: 
   - Paso 1: Completa datos de instalación y mandante
   - Paso 2: Agrega líneas y tanques
   - Paso 3: Registra pruebas (cálculo automático de GPH)
   - Paso 4: Completa datos finales y firmas
4. **Guardar Borrador** o **Enviar a Revisión**
5. **Ver/Editar**: Consultar cartillas guardadas
6. **Exportar PDF**: Generar reporte profesional

## 📱 Responsive

- **Móvil**: < 768px - Layout vertical, navegación simplificada
- **Tablet**: 768px - 1024px - Ideal para uso en terreno
- **Desktop**: > 1024px - Máxima productividad

## 🔐 Roles y Permisos

- **OPERADOR**: Crear y editar borradores propios
- **SUPERVISOR**: Revisar, aprobar/rechazar cartillas
- **ADMIN**: Acceso total + configuración de catálogos

## 📄 Exportación PDF

El PDF generado incluye:
- Header con logo Petrolab
- Datos completos de instalación y mandante
- Tabla de líneas y tanques
- Tabla de pruebas con resultados
- Firmas digitales
- Footer con paginación y fecha de generación

## 🎯 Roadmap - FASE 2 (Backend)

### Tecnologías Recomendadas

**Opción A** (Recomendada):
- Node.js + Express/NestJS
- MongoDB Atlas
- JWT Authentication
- Bcrypt para contraseñas

**Opción B**:
- Spring Boot
- MongoDB o PostgreSQL
- Spring Security + JWT

### Funcionalidades Backend

- [ ] API REST completa
- [ ] Autenticación JWT
- [ ] CRUD de cartillas
- [ ] Gestión de usuarios
- [ ] Historial de cambios
- [ ] Aprobación/rechazo workflow
- [ ] Envío de email con PDF
- [ ] Configuración de tabla PSI→GPH
- [ ] Gestión de catálogos
- [ ] Dashboard analytics
- [ ] Backup automático

### Endpoints API (Propuesta)

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/cartillas
GET    /api/cartillas/:id
POST   /api/cartillas
PUT    /api/cartillas/:id
DELETE /api/cartillas/:id
POST   /api/cartillas/:id/enviar-revision
POST   /api/cartillas/:id/aprobar
POST   /api/cartillas/:id/rechazar

GET    /api/catalogos/psi-gph
PUT    /api/catalogos/psi-gph

GET    /api/users
POST   /api/users
PUT    /api/users/:id
DELETE /api/users/:id
```

## 🗄️ Base de Datos

### MongoDB (Recomendado)

```javascript
// Collections
users: {
  _id, email, passwordHash, nombre, rol, activo, createdAt
}

cartillas: {
  _id, uomNumero, instalacion, mandante, 
  fechaPrueba, estado, lineas, pruebas,
  firmas, createdBy, createdAt, updatedBy, updatedAt
}

psiGphConfig: {
  _id, tabla: [{ psi, gph }], updatedBy, updatedAt
}

auditLog: {
  _id, entity, entityId, action, userId, changes, timestamp
}
```

## 🧪 Testing

Para implementar en Fase 2:

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage
npm run test:coverage
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)

```bash
npm run build
# Subir carpeta dist/
```

### Backend (Railway/Render/AWS)

```bash
# Configurar variables de entorno
MONGODB_URI=...
JWT_SECRET=...
PORT=3001

# Iniciar
npm start
```

## 📝 Licencia

© 2026 Petrolab Chile - Todos los derechos reservados

---

## 👨‍💻 Autor

Desarrollado para Petrolab Chile
Sistema de Cartilla de Terreno de Líneas FR024

---

## 🆘 Soporte

Para soporte técnico o consultas:
- Email: soporte@petrolab.cl
- Teléfono: +56 2 XXXX XXXX

---

**Versión**: 1.0.0 (Fase 1 - Frontend)  
**Fecha**: Enero 2026
