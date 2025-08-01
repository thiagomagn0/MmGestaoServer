import express from 'express';
const router = express.Router();
import Regiao from '../models/Regiao.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.use(authMiddleware);

// Listar todas
router.get('/', async (req, res) => {
  const regioes = await Regiao.find().sort({ nome: 1 });
  res.json(regioes);
});

// Criar
router.post('/', async (req, res) => {
  try {
    if (!req.body.nome || !req.body.taxaEntrega) {
      return res.status(400).json({ msg: 'Nome e taxa de entrega são obrigatórios' });
    }
    const nova = new Regiao({
      nome: req.body.nome,
      taxaEntrega: req.body.taxaEntrega || 0
    });
    await nova.save();
    res.status(201).json(nova);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar região' });
  }
});

// Atualizar
router.put('/:id', async (req, res) => {
  try {
    const atualizada = await Regiao.findByIdAndUpdate(
      req.params.id,
      {
        nome: req.body.nome,
        taxaEntrega: req.body.taxaEntrega,
      },
      { new: true }
    );

    if (!atualizada) {
      return res.status(404).json({ error: 'Região não encontrada' });
    }

    res.json(atualizada);
  } catch (error) {
    console.error('Erro ao atualizar região:', error);
    res.status(500).json({ error: 'Erro ao atualizar região' });
  }
});

// Deletar
router.delete('/:id', async (req, res) => {
  await Regiao.findByIdAndDelete(req.params.id);
  res.json({ msg: 'Região removida' });
});

export default router;
