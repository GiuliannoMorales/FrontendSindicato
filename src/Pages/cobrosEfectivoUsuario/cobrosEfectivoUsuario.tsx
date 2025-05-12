import React from 'react';
import './cobrosEfectivoUsuario.css';
import Layout from '../../components/Layout';

const CobrosEfectivo = () => {
  return (
    <Layout>
 <div className='contenido'>
        <div className='titulo'>
            <h1>REALIZAR COBRO</h1>
        </div>
        <div className='buscar-contenido'>
            <p>Buscar por nombre:  </p>
            <input type='text' className='BuscadorUsuario' id='BuscadorUsuario' placeholder='Buscar... ' />
        </div>
    </div>

    </Layout>
   
  );
};

export default CobrosEfectivo;
