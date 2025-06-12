import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/index';
import { jwtDecode } from 'jwt-decode';
import ModalMensagem from '../components/ModalMensagem';
import {
  FiClipboard,
  FiAlignLeft,
  FiTag,
  FiCheckCircle,
  FiUser,
  FiMessageCircle,
  FiSend,
  FiRefreshCw
} from 'react-icons/fi';
import '../styles/detalhesChamado.css';
import LoadingSpinner from '../components/LoadingSpinner';

export default function DetalhesChamado() {
  const { id } = useParams();
  const [chamado, setChamado] = useState(null);
  const [comentarios, setComentarios] = useState([]);
  const [chat, setChat] = useState([]);
  const [mensagemComentario, setMensagemComentario] = useState('');
  const [mensagemChat, setMensagemChat] = useState('');
  const [modal, setModal] = useState({ mensagem: '', tipo: '' });
  const [novoStatus, setNovoStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const usuario = jwtDecode(localStorage.getItem('token'));

  useEffect(() => {
  carregarDados(); 

  const interval = setInterval(() => {
    carregarDados(); 
  }, 10000);

  return () => clearInterval(interval); // limpa intervalo ao desmontar
}, [id]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [resChamado, resComentarios, resChat] = await Promise.all([
        api.get(`/tickets/${id}`),
        api.get(`/comentarios/${id}`),
        api.get(`/chat/${id}`)
      ]);
      setChamado(resChamado.data);
      setComentarios(resComentarios.data);
      setChat(resChat.data);
    } catch {
      abrirModal('Erro ao carregar dados.', 'erro');
    } finally {
      setLoading(false);
    }
  };

  const abrirModal = (mensagem, tipo) => setModal({ mensagem, tipo });
  const fecharModal = () => setModal({ mensagem: '', tipo: '' });

  const enviarComentario = async e => {
    e.preventDefault();
    if (!mensagemComentario.trim()) return;
    try {
      await api.post(`/comentarios/${id}`, { mensagem: mensagemComentario });
      setMensagemComentario('');
      abrirModal('Comentário enviado.', 'sucesso');
      carregarDados();
    } catch {
      abrirModal('Erro ao enviar comentário.', 'erro');
    }
  };

  const enviarChat = async e => {
    e.preventDefault();
    if (!mensagemChat.trim()) return;
    try {
      await api.post(`/chat/${id}`, { texto: mensagemChat });
      setMensagemChat('');
      abrirModal('Mensagem enviada.', 'sucesso');
      carregarDados();
    } catch {
      abrirModal('Erro ao enviar mensagem de chat.', 'erro');
    }
  };

  const atualizarStatus = async () => {
    if (!novoStatus) return;
    try {
      await api.put(`/tickets/${id}/status`, { status: novoStatus });
      abrirModal('Status atualizado.', 'sucesso');
      carregarDados();
    } catch {
      abrirModal('Erro ao atualizar status.', 'erro');
    }
  };

  if (loading || !chamado) return <LoadingSpinner />;

  const isConcluido = chamado.status?.toLowerCase() === 'concluido';
  const podeEditar = ['admin', 'tecnico'].includes(usuario.role);

  return (
    <div className="container-detalhes-chamado">
      <h2 className="title"><FiClipboard className="icon" size={24} /> Detalhes do Chamado</h2>

      <div className="info-chamado">
        <p><FiAlignLeft className="icon" size={18} /><strong> Título:</strong> {chamado.title}</p>
        <p><FiAlignLeft className="icon" size={18} /><strong> Descrição:</strong> {chamado.description}</p>
        <p><FiTag className="icon" size={18} /><strong> Categoria:</strong> {chamado.categoria}</p>
        <p><FiCheckCircle className="icon" size={18} /><strong> Status:</strong> {chamado.status}</p>
        <p><FiUser className="icon" size={18} /><strong> Criado por:</strong> {chamado.createdBy?.name || 'Desconhecido'}</p>
      </div>

      {podeEditar && (
        <div className="status-update">
          <select
            value={novoStatus}
            onChange={e => setNovoStatus(e.target.value)}
            aria-label="Atualizar status do chamado"
          >
            <option value="">Atualizar status</option>
            <option value="Aberto">Aberto</option>
            <option value="em_andamento">Em Andamento</option>
            <option value="Concluido">Concluído</option>
          </select>
          <button onClick={atualizarStatus} className="btn-primary btn-update">
            <FiRefreshCw className="icon" size={18} /> Atualizar
          </button>
        </div>
      )}

      <hr />

      <section className="comentarios-section">
        <h3><FiMessageCircle className="icon" size={20} /> Comentários</h3>
        {comentarios.length === 0 ? (
          <p className="empty-msg">Sem comentários ainda.</p>
        ) : (
          comentarios.map(com => (
            <div key={com._id} className="comentario-item">
              <FiUser className="icon" size={16} /> <strong>{com.autor?.name || 'Anônimo'}:</strong> {com.mensagem}
            </div>
          ))
        )}

        {!isConcluido && (
          <form onSubmit={enviarComentario} className="form-comentario">
            <textarea
              value={mensagemComentario}
              onChange={e => setMensagemComentario(e.target.value)}
              placeholder="Escreva um comentário..."
              rows={3}
            />
            <button type="submit" className="btn-primary submit-btn">
              <FiSend className="icon" size={16} /> Comentar
            </button>
          </form>
        )}
      </section>

      <hr />

      <section className="chat-section">
        <h3><FiMessageCircle className="icon" size={20} /> Chat</h3>
        {chat.length === 0 ? (
          <p className="empty-msg">Sem mensagens no chat.</p>
        ) : (
          chat.map(msg => (
            <div key={msg._id} className="chat-msg">
              <FiUser className="icon" size={16} /> <strong>{msg.autor?.name || 'Anônimo'}:</strong> {msg.texto}
            </div>
          ))
        )}

        {!isConcluido && (
          <form onSubmit={enviarChat} className="form-chat">
            <input
              type="text"
              value={mensagemChat}
              onChange={e => setMensagemChat(e.target.value)}
              placeholder="Mensagem de chat..."
              aria-label="Mensagem de chat"
            />
            <button type="submit" className="btn-primary submit-btn">
              <FiSend className="icon" size={16} /> Enviar
            </button>
          </form>
        )}
      </section>

      <ModalMensagem
        mensagem={modal.mensagem}
        tipo={modal.tipo}
        onClose={fecharModal}
      />
    </div>
  );
}

