// Configuración de la tabla PSI → GPH (Presión → Flujo de Fuga)
export const PSI_GPH_TABLE = [
  { psi: 16, gph: 3.8 },
  { psi: 17, gph: 3.9 },
  { psi: 18, gph: 4.0 },
  { psi: 19, gph: 4.1 },
  { psi: 20, gph: 4.3 },
  { psi: 21, gph: 4.4 },
  { psi: 22, gph: 4.5 },
  { psi: 23, gph: 4.6 },
  { psi: 24, gph: 4.7 },
  { psi: 25, gph: 4.7 },
  { psi: 26, gph: 4.8 },
  { psi: 27, gph: 4.9 },
  { psi: 28, gph: 5.0 },
  { psi: 29, gph: 5.1 },
  { psi: 30, gph: 5.2 },
  { psi: 31, gph: 5.3 },
  { psi: 32, gph: 5.4 },
  { psi: 33, gph: 5.5 },
  { psi: 34, gph: 5.5 },
  { psi: 35, gph: 5.6 },
  { psi: 36, gph: 5.7 },
  { psi: 37, gph: 5.8 },
  { psi: 38, gph: 5.9 },
  { psi: 39, gph: 5.9 },
  { psi: 40, gph: 6.0 },
  { psi: 41, gph: 6.1 },
  { psi: 42, gph: 6.2 },
  { psi: 43, gph: 6.2 },
  { psi: 44, gph: 6.3 },
  { psi: 45, gph: 6.4 },
  { psi: 46, gph: 6.4 },
  { psi: 47, gph: 6.5 },
  { psi: 48, gph: 6.6 }
]

/**
 * Calcula el flujo de fuga (GPH) basado en la presión de operación (PSI)
 * @param {number} psi - Presión en PSI
 * @returns {number} - Flujo en GPH
 */
export function calcularFlujoFuga(psi) {
  if (!psi || isNaN(psi)) return 0
  
  // Buscar valor exacto
  const exactMatch = PSI_GPH_TABLE.find(item => item.psi === psi)
  if (exactMatch) {
    return exactMatch.gph
  }
  
  // Interpolar linealmente si está entre dos valores
  const lowerBound = PSI_GPH_TABLE.filter(item => item.psi < psi).pop()
  const upperBound = PSI_GPH_TABLE.find(item => item.psi > psi)
  
  if (lowerBound && upperBound) {
    const ratio = (psi - lowerBound.psi) / (upperBound.psi - lowerBound.psi)
    const interpolated = lowerBound.gph + ratio * (upperBound.gph - lowerBound.gph)
    return Math.round(interpolated * 10) / 10 // Redondear a 1 decimal
  }
  
  // Si está fuera del rango, usar el más cercano
  if (psi < PSI_GPH_TABLE[0].psi) {
    return PSI_GPH_TABLE[0].gph
  }
  
  return PSI_GPH_TABLE[PSI_GPH_TABLE.length - 1].gph
}

/**
 * Obtiene información sobre el cálculo del flujo
 * @param {number} psi - Presión en PSI
 * @returns {object} - Información del cálculo
 */
export function obtenerInfoCalculo(psi) {
  if (!psi || isNaN(psi)) {
    return { gph: 0, metodo: 'N/A', mensaje: 'PSI inválido' }
  }
  
  const exactMatch = PSI_GPH_TABLE.find(item => item.psi === psi)
  if (exactMatch) {
    return {
      gph: exactMatch.gph,
      metodo: 'Exacto',
      mensaje: `Valor encontrado en tabla: ${psi} PSI → ${exactMatch.gph} GPH`
    }
  }
  
  const lowerBound = PSI_GPH_TABLE.filter(item => item.psi < psi).pop()
  const upperBound = PSI_GPH_TABLE.find(item => item.psi > psi)
  
  if (lowerBound && upperBound) {
    const gph = calcularFlujoFuga(psi)
    return {
      gph,
      metodo: 'Interpolado',
      mensaje: `Interpolado entre ${lowerBound.psi} PSI (${lowerBound.gph} GPH) y ${upperBound.psi} PSI (${upperBound.gph} GPH)`
    }
  }
  
  if (psi < PSI_GPH_TABLE[0].psi) {
    return {
      gph: PSI_GPH_TABLE[0].gph,
      metodo: 'Fuera de rango',
      mensaje: `PSI menor al mínimo (${PSI_GPH_TABLE[0].psi}). Usando valor mínimo.`
    }
  }
  
  const max = PSI_GPH_TABLE[PSI_GPH_TABLE.length - 1]
  return {
    gph: max.gph,
    metodo: 'Fuera de rango',
    mensaje: `PSI mayor al máximo (${max.psi}). Usando valor máximo.`
  }
}
