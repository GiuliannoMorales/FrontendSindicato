
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './Pages/EstadoCuenta';
import Inicio from './Pages/Inicio';
import CobrosEfectivo from './Pages/CobrosEfectivo/cobrosEfectivo';
import CobrosEfectivoUsuario from './Pages/cobrosEfectivoUsuario/cobrosEfectivoUsuario';

const App: React.FC = () => {
  return (
		<Router>
			<Routes>
				<Route path='/' element={<Inicio />} />
				<Route path="/cuenta/estado" element={<EstadoCuenta />} />
				<Route path="/cobros/realizarCobros" element={<CobrosEfectivo />} />
				<Route path="/cobros/realizarCobros/Usuario" element={<CobrosEfectivoUsuario  />} />
			</Routes>
		</Router>
	);
}

export default App

