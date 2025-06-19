import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import Modal from "../Modal/Modal";
import "./VistaUsuario.css";
import GenerarReciboPDF from "../GenerarReciboPDF/GenerarReciboPDF";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

interface Cliente {
  id: string;
  nombre: string;
  apellido: string;
  tipo: string;
  tipoParqueo: string;
}

const VistaUsuario: React.FC = () => {
  const location = useLocation();
  const cliente = location.state?.cliente as Cliente;
  const [tarifa, setTarifa] = useState<number>(0);
  const [fechaInicioPago, setFechaInicioPago] = useState<string>("");
  const [meses, setMeses] = useState<number>(0);
  const [anios, setAnios] = useState<number>(0);
  const [mostrarModal, setMostrarModal] = useState<boolean>(false);
  const [mensajeModal, setMensajeModal] = useState<string>("");
  const [mostrandoResultado, setMostrandoResultado] = useState<boolean>(false);
  const axiosPrivate = useAxiosPrivate();
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
        const resFecha = await axiosPrivate.post(
          `/pago-parqueo/fecha-correspondiente-pago-parqueo`,
          { idCliente: cliente.id },
        );
        setFechaInicioPago(resFecha.data.data || "");
      } catch (error) {
        console.error("Error al obtener la fecha de inicio de pago:", error);
      }
    };

    if (cliente?.id) {
      obtenerDatos();
    }
  }, [cliente]);

  useEffect(() => {
    const obtenerTarifa = async () => {
      try {
        const resTarifa = await axiosPrivate.get(`/tarifa/vigente`, {
          params: {
            tipoCliente: cliente.tipo,
            tipoVehiculo: cliente.tipoParqueo,
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

  const cambiarValor = (tipo: "meses" | "anios", delta: number) => {
    //const totalActual = meses + anios * 12;

    let nuevoMeses = meses;
    let nuevoAnios = anios;

    if (tipo === "meses") {
      nuevoMeses += delta;
    } else {
      nuevoAnios += delta;
    }

    const nuevoTotal = nuevoMeses + nuevoAnios * 12;

    if (nuevoMeses >= 0 && nuevoAnios >= 0 && nuevoTotal <= 36) {
      setMeses(nuevoMeses);
      setAnios(nuevoAnios);
    }
  };

  const generarMesesPago = (): string[] => {
    let baseFecha: Date;

    if (/^\d{4}-\d{2}-\d{2}$/.test(fechaInicioPago)) {
     // const [anio, mes, dia] = fechaInicioPago.split("-").map(Number);
      const [anio, mes] = fechaInicioPago.split("-").map(Number);
      baseFecha = new Date(anio, mes - 1, 1);
    } else {
      baseFecha = new Date();
    }

    const totalSolicitado = Math.min(meses + anios * 12, 36);
    const resultado: string[] = [];

    for (let i = 0; i < totalSolicitado; i++) {
      const nuevaFecha = new Date(
        baseFecha.getFullYear(),
        baseFecha.getMonth() + i,
        1,
      );
      const anio = nuevaFecha.getFullYear();
      const mes = String(nuevaFecha.getMonth() + 1).padStart(2, "0");
      resultado.push(`${anio}-${mes}-01`);
    }

    return resultado;
  };

  const mesesPago = useMemo(() => generarMesesPago(), [
    meses,
    anios,
    fechaInicioPago,
  ]);
  const montoTotal = mesesPago.length * tarifa;

  const confirmarCobro = async () => {
    try {
      if (cliente.id === idCajero) {
        setMensajeModal("El cajero no puede cobrarse a sí mismo.");
        setMostrandoResultado(true);
        return;
      }

      if (mesesPago.length === 0) {
        setMensajeModal("Debe seleccionar al menos un mes o año para pagar.");
        setMostrandoResultado(true);
        return;
      }

      const payload = {
        idCliente: cliente.id,
        meses: mesesPago,
        montoPagado: montoTotal,
      };
      console.log("mi cliente hermoso", payload);
      await axiosPrivate.post("/pago-parqueo", payload);

      const numeroTransaccion = `PAGO-${new Date().getFullYear()}-${
        String(
          Math.floor(Math.random() * 9999),
        ).padStart(4, "0")
      }`;
      GenerarReciboPDF({
        nombreCliente: `${cliente.nombre} ${cliente.apellido}`,
        monto: montoTotal,
        mesesPagados: mesesPago,
        numeroTransaccion,
      });
      setMensajeModal("Pago procesado exitosamente");
      setMostrandoResultado(true);
    } catch (error: any) {
      console.error(error);
      setMensajeModal(
        `Error: ${error.response?.data?.message || error.message}`,
      );
      setMostrandoResultado(true);
    }
  };

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
      </div>

      <h3 className="res">1. Cantidad de meses o años a pagar</h3>
      <div className="control-horizontal">
        <div className="linea-control">
          <label>Meses:</label>
          <span className="contador">
            <button onClick={() => cambiarValor("meses", -1)} className="bot">
              -
            </button>
            <input type="number" value={meses} readOnly />
            <button onClick={() => cambiarValor("meses", 1)} className="bot">
              +
            </button>
          </span>
        </div>

        <div className="linea-control">
          <label>Años:</label>
          <span className="contador">
            <button onClick={() => cambiarValor("anios", -1)} className="bot">
              -
            </button>
            <input type="number" value={anios} readOnly />
            <button onClick={() => cambiarValor("anios", 1)} className="bot">
              +
            </button>
          </span>
        </div>
      </div>

      <h3 className="res">2. Detalles del Pago</h3>
      <div className="contenedor-pago">
        <table className="table">
          <thead>
            <tr className="titul">
              <th>Mes</th>
              <th>Tarifa</th>
            </tr>
          </thead>
          <tbody>
            {mesesPago.map((fechaCompleta, index) => {
              const [anio, mes] = fechaCompleta.split("-");
              const fechaValida = new Date(
                parseInt(anio),
                parseInt(mes) - 1,
                1,
              );
              const nombreMes = fechaValida.toLocaleString("es-ES", {
                month: "long",
              });

              return (
                <tr key={index}>
                  <td>
                    {nombreMes.charAt(0).toUpperCase() + nombreMes.slice(1)} -
                    {" "}
                    {anio}
                  </td>
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
            <strong>Fecha de Inicio del Pago:</strong> {(() => {
              if (!mesesPago.length) return "";
              const [year, month, day] = mesesPago[0].split("-");
              return `${day}/${month}/${year}`;
            })()}
          </p>
          <button className="boton" onClick={() => setMostrarModal(true)}>
            CONFIRMAR COBRO
          </button>
        </div>
      </div>

      <Modal
        visible={mostrarModal}
        onClose={() => {
          setMostrarModal(false);
          if (mostrandoResultado) {
            window.location.reload();
          } else {
            setMostrandoResultado(false);
            setMensajeModal("");
          }
        }}
        onConfirm={confirmarCobro}
        mensajeFinal={mensajeModal}
        mostrandoResultado={mostrandoResultado}
      />
    </div>
  );
};

export default VistaUsuario;
