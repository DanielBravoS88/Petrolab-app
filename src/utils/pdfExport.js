import jsPDF from 'jspdf'
import 'jspdf-autotable'
import { format } from 'date-fns'

export async function exportarCartillaPDF(cartilla) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let yPos = 20

  // Función auxiliar para agregar nueva página si es necesario
  const checkPageBreak = (requiredSpace = 20) => {
    if (yPos + requiredSpace > pageHeight - 20) {
      doc.addPage()
      yPos = 20
      return true
    }
    return false
  }

  // HEADER - Fondo azul con logo
  doc.setFillColor(0, 102, 204) // Petrolab blue
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  // Logo (letra P)
  doc.setFillColor(255, 255, 255)
  doc.circle(15, 20, 8, 'F')
  doc.setTextColor(0, 102, 204)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('P', 12, 23)
  
  // Título
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.text('PETROLAB', 28, 18)
  doc.setFontSize(12)
  doc.text('Cartilla de Terreno de Líneas', 28, 24)
  doc.setFontSize(9)
  doc.text('FR024 / PC-113 / PPL 7.1-04', 28, 30)
  
  // UOM en la esquina derecha
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`UOM: ${cartilla.uomNumero}`, pageWidth - 15, 20, { align: 'right' })
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Estado: ${cartilla.estado}`, pageWidth - 15, 27, { align: 'right' })

  yPos = 50

  // DATOS DE INSTALACIÓN
  doc.setTextColor(0, 102, 204)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DE INSTALACIÓN', 15, yPos)
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const datosInstalacion = [
    ['RUT:', cartilla.instalacion.rut || '-', 'Nombre:', cartilla.instalacion.nombreSitio || '-'],
    ['Compañía:', cartilla.instalacion.compania || '-', 'Código:', cartilla.instalacion.codigo || '-'],
    ['Dirección:', cartilla.instalacion.direccion || '-', 'Comuna:', cartilla.instalacion.comuna || '-'],
    ['Ciudad:', cartilla.instalacion.ciudad || '-', 'Región:', cartilla.instalacion.region || '-'],
    ['Teléfono:', cartilla.instalacion.telefono || '-', 'Rep. Legal:', cartilla.instalacion.repLegal || '-']
  ]

  datosInstalacion.forEach(row => {
    doc.setFont('helvetica', 'bold')
    doc.text(row[0], 15, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(row[1], 40, yPos)
    doc.setFont('helvetica', 'bold')
    doc.text(row[2], 110, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(row[3], 135, yPos)
    yPos += 6
  })

  yPos += 5
  checkPageBreak(30)

  // DATOS DE MANDANTE
  doc.setTextColor(0, 102, 204)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DE MANDANTE', 15, yPos)
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')

  const datosMandante = [
    ['Tipo:', cartilla.mandante.tipo || '-', 'File N°:', cartilla.mandante.fileNumero || '-'],
    ['Nombre Legal:', cartilla.mandante.nombreLegal || '-', 'Descripción:', cartilla.mandante.descripcion || '-']
  ]

  datosMandante.forEach(row => {
    doc.setFont('helvetica', 'bold')
    doc.text(row[0], 15, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(row[1], 40, yPos)
    doc.setFont('helvetica', 'bold')
    doc.text(row[2], 110, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(row[3], 135, yPos)
    yPos += 6
  })

  yPos += 5
  checkPageBreak(30)

  // DATOS DE PRUEBA
  doc.setTextColor(0, 102, 204)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('DATOS DE PRUEBA', 15, yPos)
  yPos += 8

  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)

  doc.setFont('helvetica', 'bold')
  doc.text('Fecha:', 15, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formatDate(cartilla.fechaPrueba), 40, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Hora Inicio:', 80, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.horaInicio || '-', 105, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Hora Término:', 130, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.horaTermino || '-', 160, yPos)

  yPos += 6

  doc.setFont('helvetica', 'bold')
  doc.text('Inspector:', 15, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.inspectorNombre || '-', 40, yPos)

  doc.setFont('helvetica', 'bold')
  doc.text('Ayudante:', 110, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.ayudanteNombre || '-', 135, yPos)

  yPos += 10
  checkPageBreak(60)

  // TABLA DE LÍNEAS
  if (cartilla.lineas && cartilla.lineas.length > 0) {
    doc.setTextColor(0, 102, 204)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`LÍNEAS Y TANQUES (${cartilla.lineas.length})`, 15, yPos)
    yPos += 5

    const lineasData = cartilla.lineas.map(linea => [
      linea.numeroLinea,
      linea.numeroEstanque,
      linea.capacidadLitros ? Number(linea.capacidadLitros).toLocaleString() : '-',
      linea.tipoLinea,
      linea.diametroPulgadas,
      linea.producto
    ])

    doc.autoTable({
      startY: yPos,
      head: [['N° Línea', 'N° Estanque', 'Capacidad (L)', 'Tipo', 'Diámetro', 'Producto']],
      body: lineasData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 9,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 8
      },
      margin: { left: 15, right: 15 }
    })

    yPos = doc.lastAutoTable.finalY + 10
    checkPageBreak(60)
  }

  // TABLA DE PRUEBAS
  if (cartilla.pruebas && cartilla.pruebas.length > 0) {
    doc.setTextColor(0, 102, 204)
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.text(`PRUEBAS DE DETECTOR (${cartilla.pruebas.length})`, 15, yPos)
    yPos += 5

    const pruebasData = cartilla.pruebas.map(prueba => [
      prueba.numeroLinea,
      prueba.numeroEstanque,
      `${prueba.detectorMarca || '-'}\n${prueba.detectorModelo || ''}`,
      prueba.detectorTipo,
      prueba.presionOperacionPSI,
      prueba.flujoFugaGPH,
      prueba.resultado,
      prueba.observacion || '-'
    ])

    doc.autoTable({
      startY: yPos,
      head: [['N° Línea', 'Estanque', 'Detector', 'Tipo', 'P.Op.\n(PSI)', 'Flujo\n(GPH)', 'Result.', 'Observación']],
      body: pruebasData,
      theme: 'grid',
      headStyles: {
        fillColor: [0, 102, 204],
        textColor: [255, 255, 255],
        fontSize: 8,
        fontStyle: 'bold'
      },
      bodyStyles: {
        fontSize: 7
      },
      columnStyles: {
        4: { halign: 'center' },
        5: { halign: 'center', fontStyle: 'bold' },
        6: { halign: 'center' }
      },
      margin: { left: 15, right: 15 }
    })

    yPos = doc.lastAutoTable.finalY + 10
  }

  // FIRMAS
  checkPageBreak(80)
  
  doc.setTextColor(0, 102, 204)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text('FIRMAS', 15, yPos)
  yPos += 10

  const firmaWidth = 70
  const firmaHeight = 30
  
  // Firma Administrador
  if (cartilla.firmaAdministrador) {
    doc.addImage(cartilla.firmaAdministrador, 'PNG', 15, yPos, firmaWidth, firmaHeight)
  } else {
    doc.setDrawColor(200, 200, 200)
    doc.rect(15, yPos, firmaWidth, firmaHeight)
  }
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('_'.repeat(30), 15, yPos + firmaHeight + 5)
  doc.setFont('helvetica', 'bold')
  doc.text('Firma Administrador', 15, yPos + firmaHeight + 10)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.administradorNombre || '', 15, yPos + firmaHeight + 15)

  // Firma Inspector
  if (cartilla.firmaInspector) {
    doc.addImage(cartilla.firmaInspector, 'PNG', pageWidth - 85, yPos, firmaWidth, firmaHeight)
  } else {
    doc.setDrawColor(200, 200, 200)
    doc.rect(pageWidth - 85, yPos, firmaWidth, firmaHeight)
  }
  
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text('_'.repeat(30), pageWidth - 85, yPos + firmaHeight + 5)
  doc.setFont('helvetica', 'bold')
  doc.text('Firma Inspector', pageWidth - 85, yPos + firmaHeight + 10)
  doc.setFont('helvetica', 'normal')
  doc.text(cartilla.inspectorNombre || '', pageWidth - 85, yPos + firmaHeight + 15)

  // FOOTER
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(128, 128, 128)
    doc.text(
      `Página ${i} de ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    )
    doc.text(
      `Generado: ${format(new Date(), 'dd/MM/yyyy HH:mm')}`,
      pageWidth - 15,
      pageHeight - 10,
      { align: 'right' }
    )
  }

  // Guardar PDF
  const fileName = `Cartilla_UOM_${cartilla.uomNumero}_${cartilla.instalacion.nombreSitio.replace(/\s+/g, '_')}.pdf`
  doc.save(fileName)
}

function formatDate(dateString) {
  if (!dateString) return '-'
  try {
    return format(new Date(dateString), 'dd/MM/yyyy')
  } catch {
    return dateString
  }
}
