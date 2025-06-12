import React, { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./VistaUsuario.css";
import api from "../../api/axios";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  tipo: string;
}


const VistaUsuario: React.FC = () => {
  const location = useLocation();
  const cliente = location.state?.cliente as Cliente;
  const [tarifa, setTarifa] = useState<number>(0);
  const [fechaInicioPago, setFechaInicioPago] = useState<string>("");
  const [meses, setMeses] = useState<number>(0);
  const [anios, setAnios] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);

  const idCajero = "CAJERO_123";

  if (!cliente) {
    return (
      <div>
        No se recibió información del cliente. Por favor, vuelva a buscar el CI.
      </div>
    );
  }

  useEffect(() => {
  const obtenerDatos = async () => {
    try {
      const resFecha = await api.post(
        `/pago-parqueo/fecha-correspondiente-pago-parqueo`,
        {
          idCliente: cliente.id,
        }
      );

console.log(resFecha)
      setFechaInicioPago(resFecha.data.data || "");
    } catch (error) {
      console.error("Error al obtener la fecha de inicio de pago:", error);
    }
  };
  console.log(cliente.id)
  if (cliente?.id) {
    obtenerDatos();
  }
}, [cliente]);

useEffect(() => {
  const obtenerTarifa = async () => {
    try {
      const resTarifa = await api.get(`/tarifa/vigente`, {
        params: {
          tipoCliente: cliente.tipo,
          tipoVehiculo: "Auto",
        },
      });
      setTarifa(resTarifa.data.data.monto);
    } catch (error) {
      console.error("Error al obtener tarifa:", error);
    }
  };

  if (cliente?.tipo) {
    obtenerTarifa(); 
  }
}, [cliente]);

  const obtenerMesesPermitidos = (): number => {
    if (!fechaInicioPago) return 0;

    const inicio = new Date(fechaInicioPago);
    const ahora = new Date();
    inicio.setHours(0, 0, 0, 0);
    ahora.setHours(0, 0, 0, 0);

    if (inicio >= new Date(ahora.getFullYear(), ahora.getMonth(), 1)) {
      return 0;
    }

    const diffMeses =
      (ahora.getFullYear() - inicio.getFullYear()) * 12 +
      (ahora.getMonth() - inicio.getMonth());

    return diffMeses;
  };

  const cambiarValor = (tipo: "meses" | "anios", delta: number) => {
    const totalPermitido = obtenerMesesPermitidos();
    const totalActual = meses + anios * 12;

    let nuevoMeses = meses;
    let nuevoAnios = anios;

    if (tipo === "meses") {
      nuevoMeses += delta;
    } else {
      nuevoAnios += delta;
    }

    const nuevoTotal = nuevoMeses + nuevoAnios * 12;

    if (nuevoMeses >= 0 && nuevoAnios >= 0 && (totalPermitido === 0 || nuevoTotal <= totalPermitido)) {
      setMeses(nuevoMeses);
      setAnios(nuevoAnios);
    }
  };

  const generarMesesPago = (): string[] => {
    if (!fechaInicioPago || isNaN(new Date(fechaInicioPago).getTime())) return [];

    const fecha = new Date(fechaInicioPago);
    const totalSolicitado = meses + anios * 12;
    const maxMeses = obtenerMesesPermitidos();
    const totalFinal = Math.min(totalSolicitado, maxMeses);
    const resultado: string[] = [];

    for (let i = 0; i < totalFinal; i++) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(fecha.getMonth() + i);
      const anio = nuevaFecha.getFullYear();
      const mes = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
      resultado.push(`${anio}-${mes}-01`);
    }

    return resultado;
  };

  const mesesPago = useMemo(() => generarMesesPago(), [meses, anios, fechaInicioPago]);
  const montoTotal = mesesPago.length * tarifa;

  const confirmarCobro = async () => {
    setMostrarModal(false);

    try {
      if (cliente.id === idCajero) {
        alert("El cajero no puede cobrarse a sí mismo.");
        return;
      }

      if (mesesPago.length === 0) {
        alert("Debe seleccionar al menos un mes o año para pagar.");
        return;
      }

      const payload = {
        idCliente: cliente.id,
        meses: mesesPago,
        monto: montoTotal,
        idCajero,
      };

      const response = await api.post(
        "/pago-parqueo",
        payload,
        { headers: { "Content-Type": "application/json" } }
      );

      alert("Pago procesado exitosamente");
    } catch (error: any) {
      console.error(error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div>
      <h1>REALIZAR COBRO</h1>

      <div className="info-container">
        <div className="info-left">
          <ul className="info-list">
            <li>
              <span className="info-label">Nombre:</span> {cliente.nombre} {cliente.apellido}
            </li>
            <li>
              <span className="info-label">Tipo de Usuario:</span> {cliente.tipo}
            </li>
          </ul>
        </div>
      </div>

            <h3 className="res">1. Cantidad de meses o años a pagar</h3>
        <div className="control-horizontal">
          <div className="linea-control">
            <label>Meses:</label>
            <span className="contador">
              <button onClick={() => cambiarValor("meses", -1)} className="bot">-</button>
              <input type="number" value={meses} readOnly />
              <button onClick={() => cambiarValor("meses", 1)} className="bot">+</button>
            </span>
          </div>

          <div className="linea-control">
            <label>Años:</label>
            <span className="contador">
              <button onClick={() => cambiarValor("anios", -1)} className="bot">-</button>
              <input type="number" value={anios} readOnly />
              <button onClick={() => cambiarValor("anios", 1)} className="bot">+</button>
            </span>
          </div>
        </div>
      <h3 className="res">2. Detalles del Pago</h3>

      <div className="contenedor-pago">
        <table>
          <thead>
            <tr className="titul">
              <th>Mes</th>
              <th>Tarifa</th>
            </tr>
          </thead>
          <tbody>
            {mesesPago.map((fechaCompleta, index) => {
              const [anio, mes] = fechaCompleta.split("-");
              const fechaValida = new Date(`${anio}-${mes}-01`);
              const nombreMes = fechaValida.toLocaleString("es-ES", { month: "long" });

              return (
                <tr key={index}>
                  <td>{nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} - {anio}</td>
                  <td>{tarifa} Bs.</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="info-pago">
          <p>
            <strong>Monto Total:</strong> {montoTotal} Bs.
          </p>
          <p>
            <strong>Fecha de Inicio del Pago:</strong> {fechaInicioPago}
          </p>
          <button className="boton" onClick={() => setMostrarModal(true)}>
            CONFIRMAR COBRO
          </button>
        </div>
      </div>

      <Modal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCobro}
      />
    </div>
  );
};

export default VistaUsuario;
