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


// 🔌 Conexão com MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  });

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://mm-gestao-front.vercel.app'); // ou '*'
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
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


app.listen(PORT, () => {
  console.log(chalk.green(`🚀 Servidor rodando na porta ${PORT}`));
});

