import { toast } from 'react-toastify';
import { useEffect, useState } from 'react';
import api from '../api';
import {jwtDecode} from 'jwt-decode';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer 
} from 'recharts';;
import { 
  MdInsertChart, MdOutlineReportProblem, MdAutorenew, MdCheckCircleOutline 
} from 'react-icons/md';
import '../styles/estatisticas.css';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Estatisticas() {
  const [stats, setStats] = useState({
    aberto: 0,
    em_andamento: 0,
    concluido: 0,
  });
  const [loading, setLoading] = useState(true);
  const usuario = jwtDecode(localStorage.getItem('token'));

  useEffect(() => {
    const carregarEstatisticas = async () => {
      try {
        const rota =
          usuario.role === 'admin' || usuario.role === 'tecnico'
            ? '/tickets/stats'
            : '/tickets/stats/user';

        const res = await api.get(rota);

        const novoStats = { aberto: 0, em_andamento: 0, concluido: 0 };
        res.data.forEach(item => {
          const statusKey = item._id.toLowerCase();
          novoStats[statusKey] = item.total;
        });
        setStats(novoStats);
      } catch {
        toast.error('Erro ao carregar estatísticas.')
      }finally{
        setLoading(false);
      }
    };

    carregarEstatisticas();
  }, [usuario.role]);

  const dataGrafico = [
    { status: 'Aberto', total: stats.aberto || 0 },
    { status: 'Em andamento', total: stats.em_andamento || 0 },
    { status: 'Concluído', total: stats.concluido || 0 },
  ];
   if (loading) return <LoadingSpinner />;

  return (
    <div className="estatisticas-container">
      <h2 className="estatisticas-title">
        <MdInsertChart size={28} style={{ verticalAlign: 'middle', marginRight: 8, color: '#2563eb' }} />
        Estatísticas
      </h2>

      {}
      <div className="cards-container">
        <div className="card card-aberto">
          <h3>
            <MdOutlineReportProblem size={24} style={{ verticalAlign: 'middle', marginRight: 6, color: '#ef4444' }} />
            Aberto
          </h3>
          <p className="count">{stats.aberto || 0}</p>
        </div>
        <div className="card card-emAndamento">
          <h3>
            <MdAutorenew size={24} style={{ verticalAlign: 'middle', marginRight: 6, color: '#facc15' }} />
            Em andamento
          </h3>
          <p className="count">{stats.em_andamento || 0}</p>
        </div>
        <div className="card card-concluido">
          <h3>
            <MdCheckCircleOutline size={24} style={{ verticalAlign: 'middle', marginRight: 6, color: '#22c55e' }} />
            Concluído
          </h3>
          <p className="count">{stats.concluido || 0}</p>
        </div>
      </div>

      {}
      <div className="grafico-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={dataGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="total" fill="#2563eb" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {}
      
    </div>
  );
}
