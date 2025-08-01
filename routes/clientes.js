import express from 'express';
const router = express.Router();
import Cliente from '../models/Cliente.js';
import Pedido from '../models/Pedido.js';
import authMiddleware from '../middleware/authMiddleware.js';

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao listar clientes' });
  }
});

router.get('/pedidos-contagem', async (req, res) => {
  try {
    const contagem = await Pedido.aggregate([
      {
        $group: {
          _id: '$cliente',
          totalPedidos: { $sum: 1 },
          valorTotal: { $sum: '$total' }
        }
      }
    ]);
    res.json(contagem);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao contar pedidos' });
  }
});

router.post('/', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).json(cliente);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar cliente' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { nome, telefone, endereco, regiao } = req.body;

    const clienteAtualizado = await Cliente.findByIdAndUpdate(
      req.params.id,
      {
        nome,
        telefone,
        endereco,
        regiao, // isso deve ser o ID da região
      },
      { new: true }
    );

    res.json(clienteAtualizado);
  } catch (err) {
    console.error('Erro ao atualizar cliente:', err);
    res.status(500).json({ msg: 'Erro ao atualizar cliente' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Cliente.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Cliente deletado com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao deletar cliente' });
  }
});

export default router;