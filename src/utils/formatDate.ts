/**
 * Formatea una fecha ISO a un formato legible "HH:MM:SS - DD/MM/YYYY"
 * @param isoString Cadena de fecha en formato ISO (ej. "2025-05-28T13:43:34.206434")
 * @returns Fecha formateada como "14:50:14 - 04/05/2025"
 */
export function formatISODateToReadable(isoString: string): string {
  const date = new Date(isoString);
  
  if (isNaN(date.getTime())) {
    throw new Error('Fecha ISO no válida');
  }
  
  // Obtener componentes de la hora
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  // Obtener componentes de la fecha
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses van de 0-11
  const year = date.getFullYear();
  
  return `${hours}:${minutes}:${seconds} - ${day}/${month}/${year}`;
}