import { useState } from 'react';
import api from '../api';
import ModalMensagem from '../components/ModalMensagem'; 
import '../styles/cadastrarCategoria.css'

export default function CadastrarCategoria() {
  const [nome, setNome] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalTipo, setModalTipo] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categorias', { nome }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      setModalMsg('Categoria criada com sucesso!');
      setModalTipo('sucesso');
      setNome('');
    } catch (err) {
      setModalMsg(err.response?.data?.error || 'Erro ao criar categoria.');
      setModalTipo('erro');
    }
  };

  return (
    <div className="cadastrar-categoria-container">
      <div className="cadastrar-categoria-card">
        <h2>Cadastrar Categoria</h2>
        <form className="cadastrar-categoria-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nome da Categoria"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
          <button type="submit">
            Cadastrar Categoria
          </button>
        </form>
      </div>

      {}
      <ModalMensagem
        mensagem={modalMsg}
        tipo={modalTipo}
        onClose={() => setModalMsg('')}
      />
    </div>
  );
}
