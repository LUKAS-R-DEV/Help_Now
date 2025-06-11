import { useState } from 'react';
import { MdPerson, MdEmail, MdLock, MdHowToReg } from 'react-icons/md';

import api from '../api';
import ModalMensagem from '../components/ModalMensagem';
import '../styles/cadastrarTecnico.css';
export default function CadastrarTecnico() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalTipo, setModalTipo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        '/admin/registro-tecnico',
        { name: nome, email, password: senha },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setModalMsg('Técnico cadastrado com sucesso!');
      setModalTipo('sucesso');
      setNome('');
      setEmail('');
      setSenha('');
    } catch (err) {
      setModalMsg(err.response?.data?.error || 'Erro ao cadastrar técnico.');
      setModalTipo('erro');
    }
  };


  return (
    <div className="cadastrar-tecnico-container">
      <div className="cadastrar-tecnico-card">
        <h2>Cadastrar Técnico</h2>
        <form className="cadastrar-tecnico-form" onSubmit={handleSubmit}>
          <label className="input-label">
            <MdPerson className="icon" />
            <input
              type="text"
              placeholder="Nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </label>
          <label className="input-label">
            <MdEmail className="icon" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <label className="input-label">
            <MdLock className="icon" />
            <input
              type="password"
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </label>
          <button type="submit" className="btn-primary submit-btn">
            <MdHowToReg className="icon" />
            Cadastrar Técnico
          </button>
        </form>
      </div>
      <ModalMensagem
        mensagem={modalMsg}
        tipo={modalTipo}
        onClose={() => setModalMsg('')}
      />
    </div>
  );
}
