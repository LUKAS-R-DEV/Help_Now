const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const gerarToken = (id, role,name) => {
  return jwt.sign({ id, role,name }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

exports.register = async (req, res) => {
  const { name, email, password, role } = req.body;


  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
  }
  if(password.length<6){
     return res.status(400).json({ error: 'A senha deve ter pelo menos 6 caracteres.' });
  }

  
  const usuarioExistente = await User.findOne({ email });
  if (usuarioExistente) {
    return res.status(400).json({ error: 'E-mail já está em uso.' });
  }

  try {
    const novoUsuario = new User({
      name,
      email,
      password,
      role: role || 'cliente', 
    });

    await novoUsuario.save();

    const token = gerarToken(novoUsuario._id, novoUsuario.role,novoUsuario.name);
    res.status(201).json({
      token,
      user: {
        id: novoUsuario._id,
        name: novoUsuario.name,
        email: novoUsuario.email,
        role: novoUsuario.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao registrar usuário.' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Validações
  if (!email || !password) {
    return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
  }

  try {
    const usuario = await User.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const senhaCorreta = await bcrypt.compare(password, usuario.password);
    if (!senhaCorreta) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const token = gerarToken(usuario._id, usuario.role,usuario.name);
    res.status(200).json({
      token,
      user: {
        id: usuario._id,
        name: usuario.name,
        email: usuario.email,
        role: usuario.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao realizar login.' });
  }
};
