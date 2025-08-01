import express from 'express';
const router = express.Router();
import Pedido from '../models/Pedido.js';
import Produto from '../models/Produto.js';

// Criar pedido
router.post('/', async (req, res) => {
  try {
    const { cliente, produtos, data } = req.body; // pode receber data no corpo ou usar a data atual

       // Carrega os dados atuais dos produtos
    const produtosCompletos = await Promise.all(
      produtos.map(async (p) => {
        const produtoDB = await Produto.findById(p.produto);
        return {
          produto: p.produto,
          quantidade: p.quantidade,
          preco: produtoDB.preco,
          nome: produtoDB.nome // <- aqui gravamos o preço no momento
        };
      })
    );
    console.log('Produtos completos:', produtosCompletos);
    const total = produtosCompletos.reduce((sum, p) => sum + p.quantidade * p.preco, 0);

    const pedido = new Pedido({
      cliente,
       produtos: produtosCompletos,
      total,
      data: data ? new Date(data) : new Date(), // se data veio no body usa ela, senão usa data atual
    });

    await pedido.save();
    res.status(201).json(pedido);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao criar pedido' });
  }
}); 

// Buscar pedidos de um cliente
router.get('/', async (req, res) => {
  try {
    const { clienteId } = req.query;
    const filtro = {};
    if (clienteId) filtro.cliente = clienteId;

    const pedidos = await Pedido.find(filtro)
      .populate('produtos.produto')
      .sort({ data: -1 });

    res.json(pedidos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao buscar pedidos' });
  }
});

router.get('/getPedidos', async (req, res) => {
  try {
    const pedidos = await Pedido.find()
      .populate('cliente')
      .populate('produtos.produto')
      .sort({ data: -1 });

    // Calcula total de cada pedido (no backend ou frontend, você escolhe)
    const pedidosComTotal = pedidos.map(p => {
      const total = p.produtos.reduce((soma, item) => {
        return soma + item.quantidade * (item.produto?.preco || 0);
      }, 0);

      return {
        ...p.toObject(), // converte de mongoose doc para objeto normal
        total,
      };
    });

    res.json(pedidosComTotal);
  } catch (err) {
    console.error('Erro ao listar pedidos:', err);
    res.status(500).json({ error: 'Erro ao buscar pedidos' });
  }
});

// Listar pedidos (opcional)
router.get('/relatorios', async (req, res) => {
  const filtros = {};
  if (req.query.dataInicio || req.query.dataFim) {
    filtros.data = {};
    if (req.query.dataInicio) {
      filtros.data.$gte = new Date(req.query.dataInicio);
    }
    if (req.query.dataFim) {
      filtros.data.$lte = new Date(req.query.dataFim);
    }
  }
  if (req.query.clienteId) {
    filtros.cliente = req.query.clienteId;
  }
  if (req.query.produtoId) {
    filtros['produtos._id'] = req.query.produtoId;
  }

  const pedidos = await Pedido.find(filtros)
    .populate('cliente')
    .populate('produtos.produto') // se você usa referência
    .sort({ data: -1 });

  const relatorio = pedidos.flatMap(pedido => {
    return pedido.produtos.map(prod => ({
      data: pedido.data,
      clienteNome: pedido.cliente.nome,
      produtoNome: prod.produto?.nome || prod.nome,
      quantidade: prod.quantidade,
      valorTotal: prod.quantidade * prod.preco
    }));
  });

  res.json(relatorio);
});

// DELETE /api/pedidos/:id
router.delete('/:id', async (req, res) => {
  try {
    const pedido = await Pedido.findByIdAndDelete(req.params.id);
    if (!pedido) {
      return res.status(404).json({ msg: 'Pedido não encontrado' });
    }
    res.json({ msg: 'Pedido deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar pedido:', err);
    res.status(500).json({ msg: 'Erro ao deletar pedido' });
  }
});

export default router;