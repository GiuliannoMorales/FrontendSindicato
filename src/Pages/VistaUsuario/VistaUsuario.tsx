import React, { useState } from 'react';
import Layout from '../../components/Layout';
import Modal from '../Modal/Modal'; // Asegúrate de que la ruta sea correcta
import './VistaUsuario.css';

const VistaUsuario = () => {
  const [meses, setMeses] = useState(0);
  const [anios, setAnios] = useState(0);
  const [mostrarModal, setMostrarModal] = useState(false);

  const cambiarValor = (tipo: 'meses' | 'anios', delta: number) => {
    if (tipo === 'meses') {
      setMeses(prev => Math.max(0, prev + delta));
    } else if (tipo === 'anios') {
      setAnios(prev => Math.max(0, prev + delta));
    }
  };

  const pagos = [
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Diciembre 2024', tarifa: '50 Bs.' },
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Enero 2025', tarifa: '50 Bs.' },
    { vehiculo: 'Automóvil - 1848SHH', mes: 'Febrero - 2025', tarifa: '50 Bs.' }
  ];

  const montoTotal = pagos.length * 50;
  const fechaPago = '05/05/2025';

  const confirmarCobro = () => {
    setMostrarModal(false);
    alert('Cobro procesado exitosamente');
  };

  return (
    <Layout>
      <div>
        <div>
          <h1>REALIZAR COBRO</h1>
        </div>

        <div>
          <div className="info-container">
            <ul className="info-list">
              <li><span className="info-label">Nombre:</span> EDUARDO PONCE MILATO</li>
              <li><span className="info-label">Tipo de Usuario:</span> Administrativo</li>
            </ul>

            <ul className="info-list">
              <li><span className="info-label">Tipo de Vehículo:</span> Automóvil</li>
            </ul>
          </div>

          <p>
            Meses:
            <button onClick={() => cambiarValor('meses', -1)} className='bot'>-</button>
            <input type="number" value={meses} readOnly />
            <button onClick={() => cambiarValor('meses', 1)} className='bot'>+</button>
          </p>

          <p>
            Años:
            <button onClick={() => cambiarValor('anios', -1)} className='bot'>-</button>
            <input type="number" value={anios} readOnly />
            <button onClick={() => cambiarValor('anios', 1)} className='bot'>+</button>
          </p>

          <h3>2. Detalles del Pago</h3>

          <div className="contenedor-pago">
            <table>
              <thead>
                <tr className="titul">
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

            <div className="info-pago">
              <p><strong>Monto Total:</strong> {montoTotal} Bs.</p>
              <p><strong>Fecha de Pago:</strong> {fechaPago}</p>
              <button className="boton" onClick={() => setMostrarModal(true)}>
                CONFIRMAR COBRO
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={mostrarModal}
        onClose={() => setMostrarModal(false)}
        onConfirm={confirmarCobro}
      />
    </Layout>
  );
};

export default VistaUsuario;
