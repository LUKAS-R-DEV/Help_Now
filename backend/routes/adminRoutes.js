const express = require('express');
const router = express.Router();
const verificarAdmin = require('../middleware/verificarAdmin');
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.post('/registro-tecnico', verificarAdmin, async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Preencha todos os campos.' });
    }

    try {
        const userExistente = await User.findOne({ email });
        if (userExistente) {
            return res.status(400).json({ error: 'E-mail já está em uso.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const novoTecnico = new User({
            name,
            email,
            password: hashedPassword,
            role: 'tecnico'
        });

        await novoTecnico.save();

        res.status(201).json({ message: 'Técnico cadastrado com sucesso.' });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar técnico.' });
    }
});
router.post('/registro-categoria', verificarAdmin,async (req, res) => {
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

  try {
    const existente = await Category.findOne({ nome });
    if (existente) return res.status(400).json({ error: 'Categoria já existe.' });

    const novaCategoria = new Category({ nome });
    await novaCategoria.save();

    res.status(201).json({ message: 'Categoria criada com sucesso.', categoria: novaCategoria });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
});




module.exports = router;
