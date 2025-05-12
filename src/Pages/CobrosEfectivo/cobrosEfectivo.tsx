import React from 'react';
import './cobrosEfectivo.css';
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
            <input type='text' className='BuscadorNombre' id='BuscadorNombre' placeholder='Buscar... ' />
        </div>
        <div>
            <p>o</p>
        </div>
        <div className='buscar-contenido'>
            <p>Buscar por C.I:   </p>
            <input type='text' className='BuscadorCi' id='buscadorCi' placeholder='Buscar... ' />
        </div>
    </div>
    </Layout>
    
  );
};

export default CobrosEfectivo;
