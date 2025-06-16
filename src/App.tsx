


import React from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import EstadoCuenta from "./pages/EstadoCuenta/EstadoCuenta";
import Inicio from "./pages/Inicio";
import TarifasHistoPage from "./pages/Tarifas/TarifasHistoPage/TarifasHistoPage";
import TarifasPage from "./pages/Tarifas/TarifasConfigPage/TarifasConfigPage";
import User from "./pages/Users/User";
import Usuarios from "./pages/ListaUsuarios/Usuarios";
import RegistrarVehiculo from "./pages/RegistrarVehiculo/RegistrarVehiculo";
import InternalUser from "./pages/InternalUsers/InternalUserPage";
import Layout from "./components/Layout";
import LoginPage from "./pages/Login/LoginPage";
import RequireAuth from "./features/auth/RequireAuth";
import Unauthorized from "./pages/Unauthorized/Unauthorized";
import PersistLogin from "./features/auth/PersistLogin";
import VisualizarDatos from './pages/VisualizarDatos/VisualizarDatos';
import VisualizarVehiculo from './pages/VisualizarVehiculo/VisualizarVehiculo';
import VistaUsuario from "./pages/VistaUsuario/VistaUsuario";
import CobrosEfectivo from "./pages/CobrosEfectivo/cobrosEfectivo";

const ROLES = {
  ADMIN: "ADMINISTRADOR",
  CAJERO: "CAJERO",
  CLIENTE: "CLIENTE",
};

const App: React.FC = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/login" element={<LoginPage />}></Route>
      <Route path="/unauthorized" element={<Unauthorized />}></Route>

      <Route element={<PersistLogin />}>
        <Route path="/" element={<Layout />}>
          {/* protected routes  */}
          <Route element={<RequireAuth />}>
            <Route index element={<Inicio />} />
          </Route>

          {/* protected routes for the admin */}
          <Route element={<RequireAuth allowedRoles={[ROLES.ADMIN]} />}>
            <Route path="/tarifas/historial" element={<TarifasHistoPage />} />
            <Route path="/tarifas/configuracion" element={<TarifasPage />} />
            <Route path="/registrar/usuario" element={<User />} />
            <Route path="/ver/usuarios" element={<Usuarios />} />
            <Route path="/registrar/vehiculo" element={<RegistrarVehiculo />} />
            <Route
              path="/registrar/usuario-interno"
              element={<InternalUser />}
            />
          </Route>
          <Route path="/vehiculo/:id/:idParqueo" element={<VisualizarVehiculo/>} />
          <Route path="/Datos/:id" element={<VisualizarDatos />} />

          {/* protected routes for the cashier */}
          <Route
            element={<RequireAuth allowedRoles={[ROLES.CAJERO]} />}
          ></Route>
          <Route path="/cobros/realizarCobros" element={<CobrosEfectivo />} />
          <Route path="/cobros/Formulario" element={<VistaUsuario />} />
          {/* protected routes for the client */}
          <Route element={<RequireAuth allowedRoles={[ROLES.CLIENTE]} />}>
            <Route path="/cuenta/estado" element={<EstadoCuenta />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
