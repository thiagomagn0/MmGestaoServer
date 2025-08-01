import express from 'express';
const app = express();
app.use('/uploads', express.static('uploads'));
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import clientesRoutes from './routes/clientes.js';
import produtosRoutes from './routes/produtos.js';
import pedidosRoutes from './routes/pedidos.js';
import regioesRoutes from './routes/regioes.js';
import relatoriosRoutes from './routes/relatorios.js';
import graficosRoutes from './routes/graficos.js';
import authMiddleware from './middleware/authMiddleware.js';
import dotenv from 'dotenv';
dotenv.config();



const PORT = process.env.PORT || 5000;


connectDB();
const corsOptions = {
  origin: ['http://localhost:5173', 'https://mmgestao.vercel.app','https://mmgestao.up.railway.app'], // adicione todas as origens válidas aqui
  credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));
app.use(express.json());

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
  console.log(`Servidor rodando na porta ${PORT}`);
});

