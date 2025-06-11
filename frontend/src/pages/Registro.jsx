import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUserPlus } from 'react-icons/fi'; 
import api from '../api';
import ModalMensagem from '../components/ModalMensagem'; 
import '../styles/registro.css';

export default function Registro() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [tipoMensagem, setTipoMensagem] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (senha !== confirmarSenha) {
      setTipoMensagem('erro');
      setMensagem('As senhas não coincidem.');
      return;
    }
    if (senha.length < 6) {
      setTipoMensagem('erro');
      setMensagem('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    try {
      await api.post('/auth/register', {
        name: nome,
        email: email,
        password: senha
      });
      setTipoMensagem('sucesso');
      setMensagem('Registro realizado com sucesso! Você será redirecionado.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setTipoMensagem('erro');
      setMensagem(err.response?.data?.error || 'Erro ao registrar usuário.');
    }
  };

  return (
    <div className="registro-container">
      <div className="registro-card">
        <div className="registro-icon">
          <FiUserPlus size={64} color="#0284c7" />
          <h2>Criar Conta</h2>
        </div>
        <form onSubmit={handleSubmit} className="registro-form">
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Crie uma senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Repita a senha"
            value={confirmarSenha}
            onChange={(e) => setConfirmarSenha(e.target.value)}
            required
          />
          <button type="submit">Registrar</button>
        </form>
        <p className="registro-footer">
          Já tem uma conta? <Link to="/login">Entrar</Link>
        </p>
      </div>

      <ModalMensagem
        mensagem={mensagem}
        tipo={tipoMensagem}
        onClose={() => setMensagem('')}
      />
    </div>
  );
}
