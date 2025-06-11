import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:5000/api'
})

export const getTickets = () => api.get('/tickets')
export const createTicket = (ticket) => api.post('/tickets', ticket)