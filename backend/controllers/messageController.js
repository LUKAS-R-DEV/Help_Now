const Message=require('../models/Message');
const Ticket = require('../models/Ticket');
const{enviarEmail}=require('../utils/emailService');


exports.sendMessage = async (req, res) => {
  const { ticketId } = req.params;
  const { texto } = req.body;

  if (!texto) {
    return res.status(400).json({ error: 'Mensagem não pode estar vazia' });
  }

  try {
    const mensagem = await Message.create({
      ticket: ticketId,
      autor: req.user.id,
      texto,
    });

    // Tenta buscar o ticket e o autor para envio do e-mail (caso aplicável)
    try {
      const ticket = await Ticket.findById(ticketId).populate('createdBy', 'name email');
      const autor = ticket?.createdBy;

      if (autor && autor.email) {
        const para = autor.email;
        const assunto = `Nova mensagem no seu chamado "${ticket.title}"`;
        const conteudo = `Olá ${autor.name || 'usuário'},\n\n` +
          `Uma nova mensagem foi enviada no chamado "${ticket.title}":\n\n` +
          `${texto}`;
         
        try {
          await enviarEmail(para, assunto, conteudo);
          console.log(`📧 E-mail enviado para ${para}`);
        } catch (emailError) {
          console.warn(`⚠️ Falha ao enviar e-mail para ${para}:`, emailError.message || emailError);
        }
      } else {
        console.log('ℹ️ Autor do ticket não possui e-mail válido. Nenhum e-mail foi enviado.');
      }
    } catch (err) {
      console.warn('⚠️ Falha ao buscar ticket ou autor para envio de e-mail:', err.message || err);
    }

    
    res.status(201).json(mensagem);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao enviar mensagem' });
  }
};
exports.getMessagesByTicket=async(req,res)=>{
    const {ticketId}=req.params;

    try{
        const mensagens=await Message.find({ticket:ticketId})
        .populate('autor','name role')
        .sort({createdAt:1});
        res.status(200).json(mensagens);

    }catch(err){
        res.status(500).json({error:'Erro ao buscar mensagem.'})
    }
}