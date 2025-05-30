import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./VistaUsuario.css";

interface Cliente {
  idCliente: string;
  nombre: string;
  apellido: string;
  tipo: string;
}

interface Vehiculo {
  idVehiculo: string;
  tipo: string;
  placa: string;
  idCliente: string;
}

interface Tarifa {
  tipoCliente: string;
  tipoVehiculo: string;
  monto: number;
}

const VistaUsuario: React.FC = () => {
  const location = useLocation();
  const cliente = location.state?.cliente as Cliente | undefined;

  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [tarifa, setTarifa] = useState<number>(0);
  const [fechaInicioPago, setFechaInicioPago] = useState<string>("");
  const [meses, setMeses] = useState<number>(0);
  const [anios, setAnios] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);

  const idCajero = "CAJERO_123"; // Simulado - reemplazar con ID real del cajero logueado

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
        const resVehiculos = await fetch(
          "https://backendproyectoparqueoumss.onrender.com/api/vehiculo/activos",
          {
            method: "POST",
            body: JSON.stringify({ id: cliente.id }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const dataVehiculos = await resVehiculos.json();
        const vehiculosCliente: Vehiculo[] = dataVehiculos.data.filter(
          (v: Vehiculo) => String(v.idCliente) === String(cliente.idCliente)
        );

        setVehiculos(vehiculosCliente);

        const resFecha = await fetch(
          "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo/fecha-correspondiente-pago-parqueo",
          {
            method: "POST",
            body: JSON.stringify({
              idCajero: "55555555-5555-5555-5555-555555555555",
              idParqueo: vehiculos[0].idParqueo,
            }),
            headers: { "Content-Type": "application/json" },
          }
        );
        const dataFecha = await resFecha.json();

        setFechaInicioPago(dataFecha.data?.fecha || "");
      } catch (error) {
        console.error("Error al obtener vehículos o fecha:", error);
      }
    };

    obtenerDatos();
  }, [cliente]);

  useEffect(() => {
    const obtenerTarifa = async () => {
      try {
        console.log("tipo cliente", cliente.tipo);
        const resTarifa = await fetch(
          `https://backendproyectoparqueoumss.onrender.com/api/tarifa/vigente?tipoCliente=${cliente.tipo}&tipoVehiculo=${vehiculos[0].tipo}`
        );
        const dataTarifa = await resTarifa.json();
       
        console.log(dataTarifa.data)
        setTarifa(dataTarifa.data.monto);
      } catch (error) {
        console.error("Error al obtener tarifa:", error);
      }
    };

    if (vehiculos.length > 0) {
      obtenerTarifa();
    }
  }, [vehiculos, cliente]);

  const cambiarValor = (tipo: "meses" | "anios", delta: number) => {
    if (tipo === "meses") {
      setMeses((prev) => Math.max(0, prev + delta));
    } else {
      setAnios((prev) => Math.max(0, prev + delta));
    }
  };

  const generarMesesPago = (): string[] => {
    const fecha = new Date(fechaInicioPago);
    const totalMeses = meses + anios * 12;
    const resultado: string[] = [];

    for (let i = 0; i < totalMeses; i++) {
      const nuevaFecha = new Date(fecha);
      nuevaFecha.setMonth(fecha.getMonth() + i);
      const anio = nuevaFecha.getFullYear();
      const mes = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
      resultado.push(`${anio}-${mes}`);
    }

    return resultado;
  };

  const confirmarCobro = async () => {
    setMostrarModal(false);

    try {
      if (cliente.idCliente === idCajero) {
        alert("El cajero no puede cobrarse a sí mismo.");
        return;
      }

      if (!vehiculos[0]) {
        alert("No se ha seleccionado un vehículo válido.");
        return;
      }

      const mesesPago = generarMesesPago();

      if (mesesPago.length === 0) {
        alert("Debe seleccionar al menos un mes o año para pagar.");
        return;
      }

      const payload = {
        idCliente: cliente.idCliente,
        idVehiculo: vehiculos[0].idVehiculo,
        meses: mesesPago,
        monto: montoTotal,
        idCajero,
      };

      const response = await fetch(
        "https://backendproyectoparqueoumss.onrender.com/api/pago-parqueo",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Error al procesar el pago.");
      }

      alert("Pago procesado exitosamente");
    } catch (error) {
      const err = error as Error;
      console.error(err);
      alert(`Error: ${err.message}`);
    }
  };

  const pagos = Array.from({ length: meses + anios * 12 }, (_, i) => ({
    vehiculo: `${vehiculos[0]?.tipo} - ${vehiculos[0]?.placa}`,
    mes: `Mes ${i + 1}`,
    tarifa: `${tarifa} Bs.`,
  }));

  const montoTotal = pagos.length * tarifa;

  return (
    <div>
      <h1>REALIZAR COBRO</h1>

      <div className="info-container">
        <div className="info-left">
          <ul className="info-list">
            <li>
              <span className="info-label">Nombre:</span> {cliente.nombre}{" "}
              {cliente.apellido}
            </li>
            <li>
              <span className="info-label">Tipo de Usuario:</span>{" "}
              {cliente.tipo}
            </li>
          </ul>
        </div>

        <div className="info-right">
          <ul className="info-list">
            <li>
              <span className="info-label">Tipo de Vehículo:</span>{" "}
              {vehiculos[0]?.tipo || "Sin vehículo"}
            </li>
          </ul>
        </div>
      </div>

      <h3 className="res">1. Cantidad de meses o años a pagar</h3>
      <p>
        Meses:
        <button onClick={() => cambiarValor("meses", -1)} className="bot">
          -
        </button>
        <input type="number" value={meses} readOnly />
        <button onClick={() => cambiarValor("meses", 1)} className="bot">
          +
        </button>
      </p>

      <p>
        Años:
        <button onClick={() => cambiarValor("anios", -1)} className="bot">
          -
        </button>
        <input type="number" value={anios} readOnly />
        <button onClick={() => cambiarValor("anios", 1)} className="bot">
          +
        </button>
      </p>

      <h3 className="res">2. Detalles del Pago</h3>

      <div className="contenedor-pago">
        <table>
          <thead>
            <tr className="titul">
              <th>Vehículo</th>
              <th>Mes</th>
              <th>Tarifa</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => (
              <tr key={index}>
                <td>{pago.vehiculo}</td>
                <td>{pago.mes}</td>
                <td>{tarifa}</td>
              </tr>
            ))}
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
