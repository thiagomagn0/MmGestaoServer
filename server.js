// 


import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Conectar ao MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch((err) => {
    console.error('❌ Erro ao conectar MongoDB:', err.message);
    process.exit(1);
  });

// Configurar CORS para sua origem frontend
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://mm-gestao-front.vercel.app'
  ],
  credentials: true,
}));

app.use(express.json());

// Rota teste
app.get('/', (req, res) => {
  res.send('API rodando');
});

// Rota de exemplo para login (mock)
app.post('/api/auth/login', (req, res) => {
  console.log('🚨 Requisição chegou em /api/auth/login', req.body);
  const { email, senha } = req.body;
  if (email === 'teste@teste.com' && senha === '123456') {
    return res.json({ token: 'fake-jwt-token' });
  }
  return res.status(401).json({ msg: 'Credenciais inválidas' });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});