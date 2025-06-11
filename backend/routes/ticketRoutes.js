const express = require('express');
const router = express.Router();
const {
  createTicket,
  getTickets,
  getTicketById,
  updateTicket,
  updateTicketStatus,
  getTicketStats,
  getUserTicketStats,
  toggleArchiveTicket,
} = require('../controllers/ticketController');

const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
router.get('/stats', authMiddleware, authorize('admin', 'tecnico'), getTicketStats);
router.get('/stats/user', authMiddleware, authorize('cliente'), getUserTicketStats);

router.post('/', authMiddleware, createTicket); 
router.get('/', authMiddleware, getTickets); 

router.get('/:id', authMiddleware, getTicketById);


router.put('/:id', authMiddleware, updateTicket); 
router.put('/:id/status', authMiddleware, authorize('tecnico', 'admin'), updateTicketStatus); 
router.put('/:id/archive', authMiddleware, authorize('tecnico', 'admin'), toggleArchiveTicket);



module.exports = router;
