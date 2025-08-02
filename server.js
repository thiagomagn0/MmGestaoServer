import express from 'express';
import cors from 'cors';
import chalk from 'chalk';
import dotenv from 'dotenv';
dotenv.config();
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import produtosRoutes from './routes/produtos.js';
import pedidosRoutes from './routes/pedidos.js';
import regioesRoutes from './routes/regioes.js';
import relatoriosRoutes from './routes/relatorios.js';
import graficosRoutes from './routes/graficos.js';

import authMiddleware from './middleware/authMiddleware.js';

console.log('✅ Iniciando servidor...');
console.log('PORT:', process.env.PORT);
console.log('MONGO_URI existe:', !!process.env.MONGO_URI);
console.log('JWT_SECRET existe:', !!process.env.JWT_SECRET); 



const app = express();
const PORT = process.env.PORT;


// 🔌 Conexão com MongoDB
connectDB();

app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], credentials: true }));

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

setInterval(() => {
  console.log('⏱️ Mantendo o app ativo...');
}, 10000); // a cada 10 segundos

app.post('/teste-directo', (req, res) => {
  console.log('🚨 Chegou no teste-directo!');
  res.json({ ok: true, method: req.method, body: req.body });
});