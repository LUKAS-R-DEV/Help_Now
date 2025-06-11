import { useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { FiMenu, FiLogOut, FiHome, FiUserPlus, FiBarChart2, FiLayers } from 'react-icons/fi';
import '../styles/header.css';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);
  let usuario;
  try {
    usuario = jwtDecode(localStorage.getItem('token'));
  } catch {
    usuario = null;
  }

  const toggleMenu = () => setMenuAberto(!menuAberto);

  return (
    <nav className="header-container">
      <div className="header-left">
        <button className="header-menu-btn" onClick={toggleMenu}>
          <FiMenu size={24} />
        </button>
        <Link to="/" className="header-logo">
          <FiHome size={20} />
          <span>HelpNow</span>
        </Link>
      </div>

      <div className={`header-links ${menuAberto ? 'ativo' : ''}`}>
        {(usuario?.role === 'admin' || usuario?.role === 'tecnico' || usuario?.role === 'cliente') && (
          <Link to="/estatisticas" className="header-link">
            <FiBarChart2 /> Estatísticas
          </Link>
        )}

        {usuario?.role === 'admin' && (
          <>
            <Link to="/cadastrar-tecnico" className="header-link">
              <FiUserPlus /> Técnico
            </Link>
            <Link to="/cadastrar-categoria" className="header-link">
              <FiLayers /> Categoria
            </Link>
          </>
        )}
      </div>

      <div className="header-user">
        {usuario && (
          <span className="header-user-text">
            Olá, <strong>{usuario.name || usuario.email}</strong>
          </span>
        )}
        <button
          className="header-logout"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
          title="Sair"
        >
          <FiLogOut size={18} />
        </button>
      </div>
    </nav>
  );
}
