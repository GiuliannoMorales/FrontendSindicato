
import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'

import EstadoCuenta from './pages/EstadoCuenta';
import Inicio from './pages/Inicio';
import User from './pages/Users/User';

const App: React.FC = () => {
  return (
		<Router>
			<Routes>
				<Route path='/' element={<Inicio />} />
				<Route path="/cuenta/estado" element={<EstadoCuenta />} />
				<Route path="/registrar/usuario" element={<User />} />
			</Routes>
		</Router>
	);

}

export default App
