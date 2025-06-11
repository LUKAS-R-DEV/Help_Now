const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.post('/', auth, authorize('admin'), async (req, res) => {
  const { nome } = req.body;

  if (!nome) return res.status(400).json({ error: 'Nome da categoria é obrigatório.' });

  try {
    const existente = await Category.findOne({ nome });
    if (existente) return res.status(400).json({ error: 'Categoria já existe.' });

    const nova = await Category.create({ nome });
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar categoria.' });
  }
});


router.get('/', auth, async (req, res) => {
  try {
    const categorias = await Category.find().sort({ nome: 1 });
    res.status(200).json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar categorias.' });
  }
});

module.exports = router;
