import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiGrid, FiPlusCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../api/index';
import '../styles/dashboard.css';
import LoadingSpinner from '../components/LoadingSpinner';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Dashboard() {
  const isFetching = useRef(false);
  const isInitialLoad = useRef(true);
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [searchText, setSearchText] = useState('');
  const [dateFilter, setDateFilter] = useState(null);
  const limiteHoras = 48;

  useEffect(() => {
    const fetchChamados = async (mostrarLoading = true) => {
      if (isFetching.current) return;
      isFetching.current = true;
      
      if (mostrarLoading && isInitialLoad.current) {
        setLoading(true);
      }
      
      try {
        const response = await api.get('/tickets');
        setChamados(response.data.filter(c => !c.archived));
      } catch (err) {
        toast.error('Erro ao buscar chamados.');
        console.error('Erro ao buscar chamados:', err);
      } finally {
        if (mostrarLoading && isInitialLoad.current) {
          setLoading(false);
          isInitialLoad.current = false;
        }
        isFetching.current = false;
      }
    };

    fetchChamados();

    const interval = setInterval(() => {
      fetchChamados(false);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading) return <LoadingSpinner />;

  const formatDateToLocalYMD = (isoDateStr) => {
    const localDate = new Date(isoDateStr);
    const year = localDate.getFullYear();
    const month = String(localDate.getMonth() + 1).padStart(2, '0');
    const day = String(localDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const datasComChamados = [
    ...new Set(chamados.map(ch => formatDateToLocalYMD(ch.createdAt))),
  ];

  const datasDestacadas = datasComChamados.map(dateStr => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  });

  const isSameDay = (date1, date2) =>
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate();

  const filteredChamados = chamados.filter(chamado => {
    const matchStatus = statusFilter === 'Todos' || chamado.status === statusFilter;
    const matchText =
      chamado.title.toLowerCase().includes(searchText.toLowerCase()) ||
      (typeof chamado.categoria === 'string'
        ? chamado.categoria.toLowerCase().includes(searchText.toLowerCase())
        : chamado.categoria?.nome?.toLowerCase().includes(searchText.toLowerCase()) || false);

    const chamadoData = new Date(chamado.createdAt);
    const matchDate = !dateFilter || isSameDay(chamadoData, dateFilter);

    return matchStatus && matchText && matchDate;
  });

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <FiGrid size={48} color="#0284c7" />
        <h2>Meus Chamados</h2>
      </div>

      <div className="dashboard-filters">
        <label htmlFor="statusFilter">Filtrar por status:</label>
        <select
          id="statusFilter"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="Todos">Todos</option>
          <option value="Aberto">Aberto</option>
          <option value="em_andamento">Em andamento</option>
        </select>

        <input
          type="text"
          placeholder="Buscar por título ou categoria..."
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          className="dashboard-search"
        />

        <DatePicker
          selected={dateFilter}
          onChange={date => setDateFilter(date)}
          placeholderText="Filtrar por data"
          dateFormat="dd/MM/yyyy"
          className="date-picker"
          highlightDates={datasDestacadas}
          isClearable
        />
      </div>

      <div className="dashboard-actions">
        <Link to="/tickets/new">
          <button className="dashboard-btn novo">
            <FiPlusCircle /> Novo Chamado
          </button>
        </Link>
        <Link to="/tickets/archived">
          <button className="dashboard-btn concluido">
            <FiCheckCircle /> Chamados Concluídos
          </button>
        </Link>
      </div>

      {filteredChamados.length === 0 ? (
        <p>Nenhum chamado encontrado.</p>
      ) : (
        <div className="chamados-grid">
          {filteredChamados.map(chamado => {
            const dataCriacao = new Date(chamado.createdAt);
            const agora = new Date();
            const diffHoras = Math.floor((agora - dataCriacao) / (1000 * 60 * 60));
            const categoriaNome = typeof chamado.categoria === 'string'
              ? chamado.categoria
              : chamado.categoria?.nome || '';
            const statusFormatado = chamado.status === 'em_andamento' ? 'Em andamento' : chamado.status;
            const statusClass = `ticket-status-${chamado.status.replace(' ', '')}`;
            const destaquePorTempo = (chamado.status === 'Aberto' || chamado.status === 'em_andamento') && diffHoras >= limiteHoras;

            const dataFormatada = dataCriacao.toLocaleDateString('pt-BR');

            return (
              <div
                key={chamado._id}
                className={`chamado-card ${destaquePorTempo ? 'atrasado' : ''}`}
              >
                <div className="chamado-card-header">
                  <h3>{chamado.title}</h3>
                  <span className={`chamado-status ${statusClass}`}>{statusFormatado}</span>
                </div>
                <div className="chamado-card-content">
                  <p>{chamado.description || 'Sem descrição fornecida'}</p>
                  {categoriaNome && <span className="chamado-categoria">{categoriaNome}</span>}
                </div>
                <div className="chamado-card-footer">
                  <span className="chamado-tempo">Criado em {dataFormatada}</span>
                  <Link to={`/tickets/${chamado._id}`} className="chamado-detalhes">Detalhes</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}