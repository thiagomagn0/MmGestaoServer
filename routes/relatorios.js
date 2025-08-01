import express from 'express';
import mongoose from 'mongoose';
import Pedido from '../models/Pedido.js';

const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;

router.get('/', async (req, res) => {
  try {
    const { dataInicio, dataFim, clienteId, produtoId } = req.query;

    const filtros = {};

    if (dataInicio && dataFim) {
    
      const inicio = new Date(dataInicio + 'T00:00:00.000+00:00');
      const fim = new Date(dataFim + 'T23:59:59.999+00:00');

      filtros.data = {$gte: inicio, $lte: fim
      };
    }

    if (clienteId) {filtros.cliente = new ObjectId(clienteId);}

   const pipeline = [
  { $match: filtros },
  { $unwind: '$produtos' },
];

if (produtoId) {
  pipeline.push({
    $match: { 'produtos.produto': new ObjectId(produtoId) }
  });
}

pipeline.push(
  {
    $lookup: {
      from: 'clientes',
      localField: 'cliente',
      foreignField: '_id',
      as: 'cliente',
    },
  },
  { $unwind: '$cliente' },
  {
    $project: {
      _id: 0,
      clienteNome: '$cliente.nome',
      produtoNome: '$produtos.nome', // ← nome salvo no momento do pedido
      quantidade: '$produtos.quantidade',
      valorTotal: { $multiply: ['$produtos.quantidade', '$produtos.preco'] }, // ← usa preço salvo no pedido!
      data: '$data',
    }
  },
  { $sort: { data: -1 } }
);

    const resultado = await Pedido.aggregate(pipeline);
    res.json(resultado);
  } catch (err) {
    console.error('Erro no relatório:', err);
    res.status(500).json({ msg: 'Erro ao gerar relatório' });
  }
});




export default router;
