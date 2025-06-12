import { toast } from 'react-toastify';
import { useState } from 'react';
import api from '../api';
import '../styles/cadastrarCategoria.css'

export default function CadastrarCategoria() {
  const [nome, setNome] = useState('');
 
 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categorias', { nome }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      toast.success('Categoria criada com sucesso!');
      
      setNome('');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Erro ao criar categoria.');
      
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
      
    </div>
  );
}
