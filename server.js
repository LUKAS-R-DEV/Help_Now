const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const ticketRoutes = require('./backend/routes/ticketRoutes');
const authRoutes = require('./backend/routes/authRoutes');
const categoryRoutes = require('./backend/routes/categoryRoutes');
const commentRoutes = require('./backend/routes/commentRoutes');
const messageRoutes = require('./backend/routes/messageRoutes');
const userRoutes = require('./backend/routes/userRoutes');
const adminRoutes = require('./backend/routes/adminRoutes');

const app = express();

app.use(cors({
  origin: ['https://help-now-kappa.vercel.app'], 
  credentials: true
}));


app.use(express.json());


app.use('/api/tickets', ticketRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoryRoutes);
app.use('/api/comentarios', commentRoutes);
app.use('/api/chat', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);


app.get('/', (req, res) => {
  res.send('API Help Desk rodando');
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('✅ Conectado ao MongoDB'))
  .catch(err => console.error('❌ Erro ao conectar ao MongoDB:', err));

// ✅ Porta
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando na porta ${PORT}`));
