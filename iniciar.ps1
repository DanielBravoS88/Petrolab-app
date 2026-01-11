# Script de inicio para Petrolab Cartilla App
# Ejecuta: .\iniciar.ps1

Write-Host "╔════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                                            ║" -ForegroundColor Cyan
Write-Host "║   🚀 PETROLAB - Cartilla de Terreno       ║" -ForegroundColor Cyan
Write-Host "║                                            ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Verificar Node.js
Write-Host "📦 Verificando Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js no está instalado. Por favor instala Node.js 18+ desde https://nodejs.org/" -ForegroundColor Red
    pause
    exit
}
Write-Host "✅ Node.js detectado: $nodeVersion" -ForegroundColor Green

Write-Host ""
Write-Host "Selecciona una opción:" -ForegroundColor Cyan
Write-Host "1. Instalar dependencias del Frontend" -ForegroundColor White
Write-Host "2. Iniciar Frontend (desarrollo)" -ForegroundColor White
Write-Host "3. Compilar Frontend (producción)" -ForegroundColor White
Write-Host "4. Instalar dependencias del Backend" -ForegroundColor White
Write-Host "5. Iniciar Backend (desarrollo)" -ForegroundColor White
Write-Host "6. Iniciar Frontend + Backend (ambos)" -ForegroundColor White
Write-Host "0. Salir" -ForegroundColor White
Write-Host ""

$option = Read-Host "Ingresa el número de opción"

switch ($option) {
    "1" {
        Write-Host ""
        Write-Host "📦 Instalando dependencias del frontend..." -ForegroundColor Yellow
        npm install
        Write-Host ""
        Write-Host "✅ Dependencias instaladas!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Ahora puedes iniciar el servidor con la opción 2" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Yellow
        Write-Host "Frontend disponible en: http://localhost:3000" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "Credenciales de prueba:" -ForegroundColor Yellow
        Write-Host "  📧 inspector@petrolab.cl / petrolab123" -ForegroundColor White
        Write-Host "  📧 supervisor@petrolab.cl / petrolab123" -ForegroundColor White
        Write-Host "  📧 admin@petrolab.cl / petrolab123" -ForegroundColor White
        Write-Host ""
        npm run dev
    }
    "3" {
        Write-Host ""
        Write-Host "🏗️ Compilando para producción..." -ForegroundColor Yellow
        npm run build
        Write-Host ""
        Write-Host "✅ Build completado! Archivos en carpeta 'dist/'" -ForegroundColor Green
    }
    "4" {
        Write-Host ""
        Write-Host "📦 Instalando dependencias del backend..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        Set-Location ..
        Write-Host ""
        Write-Host "✅ Dependencias del backend instaladas!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Recuerda configurar el archivo backend/.env" -ForegroundColor Yellow
    }
    "5" {
        Write-Host ""
        if (!(Test-Path "backend/.env")) {
            Write-Host "⚠️  El archivo backend/.env no existe" -ForegroundColor Yellow
            Write-Host "Creando desde .env.example..." -ForegroundColor Yellow
            Copy-Item backend/.env.example backend/.env
            Write-Host "✅ Archivo .env creado. Por favor edítalo con tus valores" -ForegroundColor Green
            Write-Host ""
            pause
        }
        Write-Host "🚀 Iniciando backend..." -ForegroundColor Yellow
        Write-Host "API disponible en: http://localhost:3001/api" -ForegroundColor Cyan
        Write-Host ""
        Set-Location backend
        npm run dev
        Set-Location ..
    }
    "6" {
        Write-Host ""
        Write-Host "🚀 Iniciando Frontend y Backend..." -ForegroundColor Yellow
        Write-Host ""
        
        # Iniciar backend en segundo plano
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; npm run dev"
        
        Start-Sleep -Seconds 2
        
        # Iniciar frontend
        Write-Host "Frontend: http://localhost:3000" -ForegroundColor Cyan
        Write-Host "Backend:  http://localhost:3001/api" -ForegroundColor Cyan
        Write-Host ""
        npm run dev
    }
    "0" {
        Write-Host ""
        Write-Host "👋 Hasta luego!" -ForegroundColor Cyan
        exit
    }
    default {
        Write-Host ""
        Write-Host "❌ Opción inválida" -ForegroundColor Red
    }
}

Write-Host ""
pause
