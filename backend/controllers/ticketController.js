const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');
const { enviarEmail }=require('../utils/emailService');




// Criar chamado
exports.createTicket = async (req, res) => {
  const { title, description, categoria } = req.body;

  if (!title || !description || !categoria) {
    return res.status(400).json({ error: 'Título, descrição e categoria são obrigatórios.' });
  }

  try {
    const ticket = await Ticket.create({
      title,
      description,
      categoria,
      createdBy: req.user.id,
      status: 'Aberto'
    });

    res.status(201).json(ticket);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar chamado!' });
  }
};

// Listar todos os chamados
exports.getTickets = async (req, res) => {
  try {
    const usuario = req.user;

    let filtro = {};
    if (usuario.role === 'cliente') {
      filtro.createdBy = usuario.id; // filtra só chamados do cliente logado
    }

    const tickets = await Ticket.find(filtro)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    res.status(200).json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar chamados' });
  }
};


// Buscar chamado por ID
exports.getTicketById = async (req, res) => {
  const id = req.params.id;

  if(!mongoose.Types.ObjectId.isValid(id)){
    return res.status(400).json({error:'ID invalido.'})
  }
  try {
    const ticket = await Ticket.findById(id).populate('createdBy','name');
    if (!ticket) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar chamado' });
  }
};

// Atualizar chamado (campos gerais)
exports.updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ticket) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }
    res.status(200).json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar chamado' });
  }
};


exports.updateTicketStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const statusPermitidos = ['Aberto', 'em_andamento', 'Concluido'];
  if (!statusPermitidos.includes(status)) {
    return res.status(400).json({ message: 'Status inválido.' });
  }

  try {
    const ticket = await Ticket.findById(id).populate('createdBy', 'name email');
    if (!ticket) {
      return res.status(404).json({ message: 'Chamado não encontrado' });
    }

    if (req.user.role !== 'tecnico' && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    ticket.status = status;
    ticket.archived = (status === 'Concluido');
    await ticket.save();

    if (ticket.createdBy?.email) {
      const para = ticket.createdBy.email;
      const assunto = `Seu chamado "${ticket.title}" foi atualizado`;
      const texto = `Olá ${ticket.createdBy.name || 'usuário'},\n\nSeu chamado "${ticket.title}" foi atualizado para "${ticket.status}".\n\nObrigado!`;

      try {
        await enviarEmail(para, assunto, texto);
        return res.json({ message: 'Status atualizado e e-mail enviado com sucesso', ticket });
      } catch (emailError) {
        console.error('Erro ao enviar e-mail:', emailError);
        return res.json({ message: 'Status atualizado, mas ocorreu um erro ao enviar o e-mail', ticket });
      }
    } else {
      return res.json({ message: 'Status atualizado, mas o e-mail do usuário não está disponível.', ticket });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao atualizar status', error });
  }
};

// Estatísticas globais
exports.getTicketStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter estatísticas' });
  }
};

exports.getUserTicketStats = async (req, res) => {
  try {
    const stats = await Ticket.aggregate([
      {
        $match: { createdBy: new mongoose.Types.ObjectId(req.user.id) }
      },
      {
        $group: {
          _id: "$status",
          total: { $sum: 1 }
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao obter estatísticas do usuário' });
  }
};

exports.toggleArchiveTicket = async (req, res) => {
  const { id } = req.params;
  const { archived } = req.body;  // true ou false

  try {
    const ticket = await Ticket.findById(id);
    if (!ticket) return res.status(404).json({ message: 'Chamado não encontrado' });

    ticket.archived = archived;
    await ticket.save();

    res.json({ message: `Chamado ${archived ? 'arquivado' : 'desarquivado'} com sucesso`, ticket });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar arquivamento', error });
  }
};



