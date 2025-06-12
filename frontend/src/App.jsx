import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {jwtDecode} from 'jwt-decode';
import './index.css';


import Login from './pages/Login';
import Registro from './pages/Registro';
import Dashboard from './pages/Dashboard';
import NovoChamado from './pages/NovoChamado';
import DetalhesChamado from './pages/DetalhesChamado';
import Header from './components/Header';
import Estatisticas from './pages/Estatisticas';
import ChamadosArquivados from'./pages/ChamadosArquivados';
import CadastrarTecnico from './pages/CadastrarTecnico';
import CadastrarCategoria from './pages/CadastrarCategoria';


function PrivateRoute({ children, rolesAllowed }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" />;
  
  let usuario;
  try {
    usuario = jwtDecode(token);
  } catch {
    localStorage.removeItem('token');
    return <Navigate to="/login" />;
  }
  
  if (rolesAllowed && !rolesAllowed.includes(usuario.role)) {
    return <Navigate to="/" />; 
  }

  return children;
}


function AppWrapper() {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/registro'];
  const [showHeader, setShowHeader] = useState(true);

  useEffect(() => {
    setShowHeader(!hideHeaderRoutes.includes(location.pathname));
  }, [location]);

  return (
    <>
      {showHeader && <Header />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/estatisticas" element={
          <PrivateRoute>
            <Estatisticas />
          </PrivateRoute>
        } />
        <Route path="/tickets/archived" element={<ChamadosArquivados />} />
        <Route path="/tickets/new" element={<PrivateRoute><NovoChamado /></PrivateRoute>} />
        <Route path="/tickets/:id" element={<PrivateRoute><DetalhesChamado /></PrivateRoute>} />
        <Route path="/cadastrar-tecnico" element={<PrivateRoute><CadastrarTecnico /></PrivateRoute>} />
        <Route path="/cadastrar-categoria" element={<PrivateRoute><CadastrarCategoria/></PrivateRoute>}/>
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
