import express from 'express';
import Pedido from '../models/Pedido.js';
import Produto from '../models/Produto.js';
import Cliente from '../models/Cliente.js';
import mongoose from 'mongoose';

const router = express.Router();

router.get('/donut', async (req, res) => {
  try {
    const { dataInicio, dataFim, agrupadoPor } = req.query;

    const filtros = {};

    if (dataInicio && dataFim) {
      filtros.data = {
        $gte: new Date(dataInicio),
        $lte: new Date(dataFim),
      };
    }

    const pipeline = [
      { $match: filtros },
      { $unwind: '$produtos' },
      {
        $lookup: {
          from: 'produtos',
          localField: 'produtos.produto',
          foreignField: '_id',
          as: 'produto',
        },
      },
      { $unwind: '$produto' },
      {
        $lookup: {
          from: 'clientes',
          localField: 'cliente',
          foreignField: '_id',
          as: 'cliente',
        },
      },
      { $unwind: '$cliente' },
    ];

    if (agrupadoPor === 'regiao') {
      pipeline.push({
        $group: {
          _id: '$cliente.regiao',
          valorTotal: {
            $sum: { $multiply: ['$produtos.quantidade', '$produto.preco'] },
          },
        },
      });
      pipeline.push({
        $lookup: {
          from: 'regiaos',
          localField: '_id',
          foreignField: '_id',
          as: 'regiao',
        },
      });
      pipeline.push({ $unwind: '$regiao' });
      pipeline.push({
        $project: {
          name: '$regiao.nome',
          valorTotal: 1,
        },
      });
    } else {
      pipeline.push({
        $group: {
          _id: '$produto._id',
          name: { $first: '$produto.nome' },
          valorTotal: {
            $sum: { $multiply: ['$produtos.quantidade', '$produto.preco'] },
          },
        },
      });
    }

    const resultado = await Pedido.aggregate(pipeline);
    res.json(resultado);
  } catch (err) {
    console.error('Erro ao gerar gráfico donut:', err);
    res.status(500).json({ msg: 'Erro ao gerar gráfico' });
  }
});


router.get('/top-produtos', async (req, res) => {
  try {
    const resultado = await Pedido.aggregate([
      { $unwind: '$produtos' },
      {
        $lookup: {
          from: 'produtos',
          localField: 'produtos.produto',
          foreignField: '_id',
          as: 'produto',
        },
      },
      { $unwind: '$produto' },
      {
        $group: {
          _id: '$produto._id',
          nome: { $first: '$produto.nome' },
          quantidade: { $sum: '$produtos.quantidade' },
          total: {
            $sum: {
              $multiply: ['$produtos.quantidade', '$produto.preco']
            }
          }
        }
      },
      { $sort: { quantidade: -1 } },
      { $limit: 5 }
    ]);

    res.json(resultado);
  } catch (err) {
    console.error('Erro no top-produtos:', err);
    res.status(500).json({ msg: 'Erro ao buscar top produtos' });
  }
});

// server/routes/relatorios.js
router.get('/top-clientes', async (req, res) => {
  try {
    const topClientes = await Pedido.aggregate([
      {
        $group: {
          _id: '$cliente',
          totalPedidos: { $sum: 1 },
          valorTotal: { $sum: '$total' }
        }
      },
      {
        $lookup: {
          from: 'clientes',
          localField: '_id',
          foreignField: '_id',
          as: 'cliente'
        }
      },
      { $unwind: '$cliente' },
      {
        $project: {
          nome: '$cliente.nome',
          totalPedidos: 1,
          valorTotal: 1
        }
      },
      { $sort: { valorTotal: -1 } },
      { $limit: 5 }
    ]);

    res.json(topClientes);
  } catch (err) {
    console.error('Erro no top-clientes:', err);
    res.status(500).json({ msg: 'Erro ao buscar top clientes' });
  }
});


export default router;
