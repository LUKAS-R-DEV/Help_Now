import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/index';
import '../styles/chamadosArquivados.css';
import ModalMensagem from '../components/ModalMensagem';
import { FaSearch, FaPlus, FaExclamationCircle, FaClipboardList, FaInfoCircle } from 'react-icons/fa';
import LoadingSpinner from '../components/LoadingSpinner';

export default function ChamadosArquivados() {
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [modalMsg, setModalMsg] = useState('');
  const [modalTipo, setModalTipo] = useState('');

  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const response = await api.get('/tickets');
        setChamados(response.data.filter(c => c.archived));
      } catch (err) {
        setModalMsg('Erro ao buscar chamados.');
        setModalTipo('erro');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchChamados();
  }, []);

   if (loading) return <LoadingSpinner />;

  const filteredChamados = chamados.filter(chamado => {
    const matchStatus = statusFilter === 'Todos' || chamado.status === statusFilter;
    const matchText =
      chamado.title?.toLowerCase().includes(searchText.toLowerCase()) ||
      chamado.categoria?.toLowerCase().includes(searchText.toLowerCase());
    return matchStatus && matchText;
  });

  return (
    <div className="container">
      <h2 className="title">
        <FaClipboardList style={{ marginRight: '8px' }} />
        Chamados Concluidos
      </h2>

      <div className="search-container">
        <FaSearch style={{ marginRight: '8px', fontSize: '1.2rem', alignSelf: 'center' }} />
        <input
          type="text"
          placeholder="Buscar por título ou categoria..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="search-input"
        />
      </div>

      <Link to="/tickets/new">
        <button className="btn-primary new-ticket-btn">
          <FaPlus style={{ marginRight: '6px' }} />
          Novo Chamado
        </button>
      </Link>

      {filteredChamados.length === 0 ? (
        <p className="no-results">
          <FaExclamationCircle style={{ marginRight: '6px' }} />
          Nenhum chamado encontrado.
        </p>
      ) : (
        <div className="cards-list">
          {filteredChamados.map((chamado) => (
            <div key={chamado._id} className="ticket-card">
              <div className="ticket-title" title={chamado.title}>
                {chamado.title || 'Sem título'}
              </div>
              <div className={`ticket-status ${chamado.status?.replace(/\s/g, '')}`}>
                {chamado.status}
              </div>
              <div className="ticket-category">
                {chamado.categoria || 'Sem categoria'}
              </div>
              {chamado._id ? (
                <Link to={`/tickets/${chamado._id}`} className="details-link">
                  <FaInfoCircle style={{ marginRight: '6px' }} />
                  Detalhes
                </Link>
              ) : (
                <span className="details-link-disabled">ID Inválido</span>
              )}
            </div>
          ))}
        </div>
      )}

      {
      }
      <ModalMensagem
        mensagem={modalMsg}
        tipo={modalTipo}
        onClose={() => setModalMsg('')}
      />
    </div>
  );
}
