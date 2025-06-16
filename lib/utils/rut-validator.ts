// Función para validar RUT chileno
export function validateRut(rut: string): boolean {
  // Limpiar el RUT
  const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();
  
  // Verificar formato básico
  if (!/^\d{7,8}[\dK]$/.test(cleanRut)) {
    return false;
  }
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const checkDigit = cleanRut.slice(-1);
  
  // Calcular dígito verificador
  let sum = 0;
  let multiplier = 2;
  
  for (let i = rutNumber.length - 1; i >= 0; i--) {
    sum += parseInt(rutNumber[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const expectedCheckDigit = 11 - (sum % 11);
  const calculatedCheckDigit = expectedCheckDigit === 11 ? '0' : expectedCheckDigit === 10 ? 'K' : expectedCheckDigit.toString();
  
  return checkDigit === calculatedCheckDigit;
}

// Función para formatear RUT
export function formatRut(rut: string): string {
  // Limpiar el RUT
  const cleanRut = rut.replace(/[.-]/g, '').toUpperCase();
  
  if (cleanRut.length < 2) {
    return cleanRut;
  }
  
  // Separar número y dígito verificador
  const rutNumber = cleanRut.slice(0, -1);
  const checkDigit = cleanRut.slice(-1);
  
  // Formatear con puntos y guión
  let formattedNumber = '';
  for (let i = rutNumber.length - 1, j = 0; i >= 0; i--, j++) {
    if (j > 0 && j % 3 === 0) {
      formattedNumber = '.' + formattedNumber;
    }
    formattedNumber = rutNumber[i] + formattedNumber;
  }
  
  return `${formattedNumber}-${checkDigit}`;
} 