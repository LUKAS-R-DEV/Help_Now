const Comment=require('../models/Comment');

exports.addComment=async(req,res)=>{
    const {ticketId}=req.params;
    const {mensagem}=req.body;

    if(!mensagem){
        return res.status(400).json({error:'Comentario não pode estar vazio.'});
    }

    try{
        const novo=await Comment.create({
            ticket:ticketId,
            autor:req.user.id,
            mensagem
        });

        res.status(201).json(novo);

    }catch(err){
        res.status(500).json({error:'Erro ao adicionar comentario'})
    }

};
exports.getCommentsByTicket = async (req, res) => {
    const { ticketId } = req.params;
  
    try {
      const comentarios = await Comment.find({ ticket: ticketId })
        .populate('autor', 'name role')
        .sort({ createdAt: 1 });
  
      res.status(200).json(comentarios);
    } catch (err) {
      res.status(500).json({ error: 'Erro ao buscar comentários.' });
    }
  };