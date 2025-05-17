import React, { useState } from 'react';
import Layout from '../../components/Layout';
import './VistaUsuario.css';


const VistaUsuario = () => {
  const [meses, setMeses] = useState(0);
  const [anios, setAnios] = useState(0);

  const cambiarValor = (tipo, delta) => {
    if (tipo === 'meses') {
      setMeses(prev => Math.max(0, prev + delta));
    } else if (tipo === 'anios') {
      setAnios(prev => Math.max(0, prev + delta));
    }
  };

  // Datos de ejemplo estáticos
  const pagos = [
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Diciembre 2024', tarifa: '50 Bs.' },
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Enero 2025', tarifa: '50 Bs.' },
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Febrero - 2025', tarifa: '50 Bs.' }
  ];

  const montoTotal = pagos.length * 50;
  const fechaPago = '05/05/2025';

  return (
    <Layout>
      <div>
        <div>
          <h1>REALIZAR COBRO</h1>
        </div>

        <div>
          <p><strong>Nombre:</strong> EDUARDO PONCE MILATO</p>
          <p><strong>Tipo de Usuario:</strong> Administrativo</p>
          <p><strong>Tipo de Vehículo:</strong> Automóvil</p>

          <h3>1. Cantidad de meses o años a pagar</h3>

          <p>
            Meses:
            <button onClick={() => cambiarValor('meses', -1)}>-</button>
            <input type="number" value={meses} readOnly />
            <button onClick={() => cambiarValor('meses', 1)}>+</button>
          </p>

          <p>
            Años:
            <button onClick={() => cambiarValor('anios', -1)}>-</button>
            <input type="number" value={anios} readOnly />
            <button onClick={() => cambiarValor('anios', 1)}>+</button>
          </p>

          <h3>2. Detalles del Pago</h3>

          <table >
            <thead>
              <tr>
                <th>Vehículo</th>
                <th>Meses</th>
                <th>Tarifa</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago, index) => (
                <tr key={index}>
                  <td>{pago.vehiculo}</td>
                  <td>{pago.mes}</td>
                  <td>{pago.tarifa}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p><strong>Monto Total:</strong> {montoTotal} Bs.</p>
          <p><strong>Fecha de Pago:</strong> {fechaPago}</p>

          <button>CONFIRMAR COBRO</button>
        </div>
      </div>
    </Layout>
  );
};

export default VistaUsuario;
