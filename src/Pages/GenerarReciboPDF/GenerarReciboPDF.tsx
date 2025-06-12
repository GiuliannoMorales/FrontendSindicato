import jsPDF from "jspdf";
import "jspdf-autotable";
import { format } from "date-fns";
import { es } from "date-fns/locale";

// Convertir número a letras con formato tipo "CIEN 00/100 Bolivianos"
const unidades = ["", "UNO", "DOS", "TRES", "CUATRO", "CINCO", "SEIS", "SIETE", "OCHO", "NUEVE"];
const decenas = ["", "", "VEINTE", "TREINTA", "CUARENTA", "CINCUENTA", "SESENTA", "SETENTA", "OCHENTA", "NOVENTA"];
const especiales: { [key: number]: string } = {
  10: "DIEZ", 11: "ONCE", 12: "DOCE", 13: "TRECE", 14: "CATORCE",
  15: "QUINCE", 16: "DIECISÉIS", 17: "DIECISIETE", 18: "DIECIOCHO", 19: "DIECINUEVE"
};

const numeroALetras = (n: number): string => {
  const entero = Math.floor(n);
  if (especiales[entero]) return `${especiales[entero]} 00/100 Bolivianos`;
  if (entero < 10) return `${unidades[entero]} 00/100 Bolivianos`;
  if (entero < 100) {
    const d = Math.floor(entero / 10);
    const u = entero % 10;
    return `${decenas[d]}${u !== 0 ? " Y " + unidades[u] : ""} 00/100 Bolivianos`;
  }
  if (entero < 1000) {
    const c = Math.floor(entero / 100);
    const resto = entero % 100;
    const cientos = c === 1 && resto === 0 ? "CIEN" : `${unidades[c]}CIENTOS`;
    return `${cientos} ${numeroALetras(resto).replace(" 00/100 Bolivianos", "")} 00/100 Bolivianos`;
  }
  return "MONTO DEMASIADO ALTO";
};

const GenerarReciboPDF = ({
  nombreCliente,
  monto,
  mesesPagados,
  numeroTransaccion,
}: {
  nombreCliente: string;
  monto: number;
  mesesPagados: string[];
  numeroTransaccion: string;
}) => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });

  // Encabezado
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.text("RECIBO", 105, 20, { align: "center" });
  doc.setFontSize(12);
  doc.text("SITUMSS", 105, 28, { align: "center" });

  // Nº de recibo (encima y fuera del cuadro)
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text(`Nº ${numeroTransaccion}`, 150, 16); // alineado al cuadro pequeño

  // Cuadro más pequeño
  doc.rect(150, 20, 35, 12); // x, y, ancho, alto
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("Bs.-", 153, 30); // alineado con el nuevo cuadro
  doc.setFont("helvetica", "normal");
  doc.text(monto.toFixed(2), 170, 30);

  // Datos del recibo
  let y = 60;
  const etiqueta = (label: string, value: string) => {
    doc.setFont("helvetica", "bold");
    doc.text(`${label}:`, 20, y);
    doc.setFont("helvetica", "normal");
    doc.text(value, 65, y);
    y += 10;
  };

  etiqueta("Recibí de", nombreCliente.toUpperCase());
  etiqueta("La suma de", numeroALetras(monto));
  
  doc.setFont("helvetica", "bold");
  doc.text("Por concepto de:", 20, y);
  y += 8;
  doc.setFont("helvetica", "normal");

  mesesPagados.forEach((mes) => {
    const texto = format(new Date(mes), "MMMM 'de' yyyy", { locale: es });
    doc.text(`Pago por uso de parqueo correspondiente al mes de ${texto}`, 25, y);
    y += 7;
  });

  // Fecha centrada
  const fechaActual = format(new Date(), "d 'de' MMMM 'de' yyyy", { locale: es });
  doc.setFont("helvetica", "normal");
  doc.text(`Cochabamba, ${fechaActual}`, 105, y + 15, { align: "center" });

  // Firmas
  doc.line(30, 240, 90, 240); // izquierda
  doc.line(130, 240, 190, 240); // derecha
  doc.text("RECIBÍ CONFORME", 40, 245);
  doc.text("ENTREGUÉ CONFORME", 140, 245);

  doc.save(`${numeroTransaccion}.pdf`);
};

export default GenerarReciboPDF;
