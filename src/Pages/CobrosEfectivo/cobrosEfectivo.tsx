import React from 'react'

const cobrosEfectivo = () => {
  return (
    <div>
        <div>
            <h1>REALIZAR COBRO</h1>
        </div>
        <div>
            <p>Buscar por nombre: </p> <input type='text' name='BuscadorNombre' id='BuscadorNombre' placeholder='Buscar... '>
            </input>
            <br></br>
            <p>o</p>
            <br></br>
            <p>Buscar por C.I: </p><input type='text' name='BuscadorCi' id='buscadorCi' placeholder='Buscar... '>
            </input>
        </div>
    </div>
  )
}

export default cobrosEfectivo
