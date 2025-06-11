
const mongoose = require('mongoose');
const Category = require('./Category');

const TicketSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String,enum:['Aberto','em_andamento','Concluido'],default: 'Aberto' },
  categoria:{type:String,ref:Category,required:true},
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  archived: { type: Boolean, default: false }
});

module.exports = mongoose.model('Ticket', TicketSchema);
