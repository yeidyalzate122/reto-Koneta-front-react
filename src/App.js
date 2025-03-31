import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/LoginForm/Login';
import PrivateRoute from './routers/PrivateRoute';
import FormUser from './components/Users/FormUser';
import ListaUser from './components/Users/ListaUser';
import FormUserUpdate from './components/Users/FormUserUpdate';
import FormVentaPro from './components/Products/FormVentaPro';
import ListVentaPro from './components/Products/ListVentaPro';
import FormModVentaPro from './components/Products/FormModVentaPro';
import VentaModal from './components/Products/VentaModal';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta pública: Login */}
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas para Administradores (id_tipo_usuario = 1) */}
        <Route element={<PrivateRoute allowedRoles={[1]} />}>
          <Route path="/FormUser" element={<FormUser />} />
          <Route path="/ListaUser" element={<ListaUser />} />
          <Route path="/FormUserUpdate/:id" element={<FormUserUpdate />} />
        </Route>

        {/* Rutas protegidas para Administradores y Asesores (id_tipo_usuario = 1 o 2) */}
        <Route element={<PrivateRoute allowedRoles={[1, 2]} />}>
          <Route path="/ListVentaPro" element={<ListVentaPro />} />
          <Route path="/FormModVentaPro/:id" element={<FormModVentaPro />} />
          <Route path="/FormVentaPro" element={<FormVentaPro />} />
          <Route path="/VentaModal/:id" element={<VentaModal />} />
        </Route>

        {/* Redirige cualquier ruta desconocida al login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
