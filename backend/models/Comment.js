const mongoose=require('mongoose');
    const commentSchema = new mongoose.Schema({
        ticket: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Ticket',
          required: true
        },
        autor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
          required: true
        },
        mensagem: {
          type: String,
          required: true
        }
      }, { timestamps: true });
module.exports = mongoose.model('Comment', commentSchema)