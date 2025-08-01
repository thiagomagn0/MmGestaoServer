import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';

import connectDB from './config/db.js';

import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import produtosRoutes from './routes/produtos.js';
import pedidosRoutes from './routes/pedidos.js';
import regioesRoutes from './routes/regioes.js';
import relatoriosRoutes from './routes/relatorios.js';
import graficosRoutes from './routes/graficos.js';

import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conexão com o banco
connectDB();
// CORS configurado para aceitar as origens certas
const corsOptions = {
  origin: ['http://localhost:5173', 'https://mm-gestao-front.vercel.app'],
  credentials: true,
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods',
    'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Max-Age', '7200');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Rotas abertas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/clientes', authMiddleware, clientesRoutes);
app.use('/api/produtos', authMiddleware, produtosRoutes);
app.use('/api/pedidos', authMiddleware, pedidosRoutes);
app.use('/api/regioes', authMiddleware, regioesRoutes);
app.use('/api/relatorios', authMiddleware, relatoriosRoutes);
app.use('/api/graficos', authMiddleware, graficosRoutes);

app.get('/', (req, res) => res.send('API rodando'));

// Função para listar rotas completas com prefixo
function logRotasComPrefixo(rotas) {
  const todasRotas = [];

  function extrairRotas(stack, basePath) {
    stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .map((m) => chalk.greenBright(m.toUpperCase()))
          .join(', ');
        todasRotas.push(`${chalk.bold('→')} ${methods} ${chalk.blue(basePath + layer.route.path)}`);
      } else if (layer.name === 'router' && layer.handle?.stack) {
        extrairRotas(layer.handle.stack, basePath);
      }
    });
  }

  rotas.forEach(({ prefixo, router }) => {
    extrairRotas(router.stack, prefixo);
  });

  if (todasRotas.length > 0) {
    console.log(chalk.cyan('\n📍 Rotas completas registradas:\n'));
    todasRotas.forEach((r) => console.log(r));
    console.log();
  } else {
    console.log(chalk.red('❌ Nenhuma rota encontrada.'));
  }
}

const rotasRegistradas = [
  { prefixo: '/api/auth', router: authRoutes },
  { prefixo: '/api/clientes', router: clientesRoutes },
  { prefixo: '/api/produtos', router: produtosRoutes },
  { prefixo: '/api/pedidos', router: pedidosRoutes },
  { prefixo: '/api/regioes', router: regioesRoutes },
  { prefixo: '/api/relatorios', router: relatoriosRoutes },
  { prefixo: '/api/graficos', router: graficosRoutes },
];

logRotasComPrefixo(rotasRegistradas);

process.on('uncaughtException', (err) => {
  console.error('Erro não capturado:', err);
});

app.listen(PORT, () => {
  console.log(chalk.green(`🚀 Servidor rodando na porta ${PORT}`));
});

