
import { useEffect, useState } from 'react';
import api from '../api/index';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    async function fetchTickets() {
      try {
        const res = await api.get('/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Erro ao carregar chamados:', err);
      }
    }
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>Chamados</h2>
      <Link to="/tickets/new">Novo Chamado</Link>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <Link to={`/tickets/${ticket._id}`}>{ticket.title} - Status: {ticket.status}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
