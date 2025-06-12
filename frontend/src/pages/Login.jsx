
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import ModalMensagem from '../components/ModalMensagem';
import '../styles/login.css';
import { FiMail, FiLock, FiLogIn, FiHeadphones } from 'react-icons/fi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMsg, setTipoMsg] = useState('');
  const navigate = useNavigate();

  const limpaMensagem = (ms = 5000) =>
    setTimeout(() => setMensagem(''), ms);

  const handleLogin = async (e) => {
    e.preventDefault();

    
    const emailValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailValido) {
      setTipoMsg('erro');
      setMensagem('Digite um e‑mail válido.');
      return limpaMensagem();
    }

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setTipoMsg('sucesso');
      setMensagem('Login realizado com sucesso!');
      setTimeout(() => {
        setMensagem('');
        navigate('/');
      }, 1500);
    } catch (err) {
      setTipoMsg('erro');
      setMensagem('Credenciais inválidas. Verifique e tente novamente.');
      limpaMensagem(4000);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <FiHeadphones size={64} color="#0284c7" />
          <h2>Help Now</h2>
        </div>

        <p>Acesse sua conta e gerencie seus chamados</p>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-icon">
            <FiMail className="icon" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="exemplo@email.com"
            />
          </div>

          <div className="input-icon">
            <FiLock className="icon" />
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit">
            <FiLogIn style={{ marginRight: '8px' }} />
            Entrar
          </button>
        </form>

        <div className="login-footer">
          Não tem uma conta? <Link to="/registro">Criar conta</Link>
        </div>
      </div>

      <ModalMensagem
        mensagem={mensagem}
        tipo={tipoMsg}
        onClose={() => setMensagem('')}
      />
    </div>
  );
}
