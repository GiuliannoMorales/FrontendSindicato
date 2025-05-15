
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './Pages/EstadoCuenta';
import Inicio from './Pages/Inicio';

const App: React.FC = () => {
  return (
		<Router>
			<Routes>
				<Route path='/' element={<Inicio />} />
				<Route path="/cuenta/estado" element={<EstadoCuenta />} />
			</Routes>
		</Router>
	);

}

export default App
