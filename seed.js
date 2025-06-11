const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');
const Category = require('./backend/models/Category');
const Ticket = require('./backend/models/Ticket');

dotenv.config();

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    // Limpar dados antigos
    await User.deleteMany();
    await Category.deleteMany();
    await Ticket.deleteMany();

    // Criar usuários
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'admin123',
      role: 'admin'
    });

    const tecnico = await User.create({
      name: 'Tecnico Silva',
      email: 'tecnico@example.com',
      password: 'tecnico123',
      role: 'tecnico'
    });

    // Criar vários clientes
    const clientes = await User.create([
      {
        name: 'Cliente João',
        email: 'cliente@example.com',
        password: 'cliente123',
        role: 'cliente'
      },
      {
        name:'Cliente Bruno',
        email:'cliente1@example.com',
        password: 'cliente123',
        role: 'cliente'
      }
    ]);

    // Criar categorias
    const categoria1 = await Category.create({ nome: 'TI' });
    const categoria2 = await Category.create({ nome: 'Financeiro' });

    // Criar chamados - exemplo usando o primeiro cliente do array
    await Ticket.create([
      {
        title: 'Erro no sistema',
        description: 'Não consigo acessar o painel.',
        categoria: categoria1.nome,
        createdBy: clientes[0]._id,   // note o [0]
        status: 'Aberto'
      },
      {
        title: 'Problema com boleto',
        description: 'Meu boleto não aparece na conta.',
        categoria: categoria2.nome,
        createdBy: clientes[0]._id,
        status: 'em_andamento'
      },
      {
        title: 'Erro no sistema windows',
        description: 'Não consigo acessar o painel.',
        categoria: categoria1.nome,
        createdBy: clientes[1]._id,   // outro cliente
        status: 'Aberto'
      },
      {
        title: 'Problema com cartao',
        description: 'Meu cartao bloqueou.',
        categoria: categoria2.nome,
        createdBy: clientes[1]._id,
        status: 'em_andamento'
      }
    ]);

    console.log('✅ Dados inseridos com sucesso!');
    process.exit();
  } catch (error) {
    console.error('❌ Erro ao executar seed:', error);
    process.exit(1);
  }
};

seed();
