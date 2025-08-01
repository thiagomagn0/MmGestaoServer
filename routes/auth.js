// import express from 'express';
// const router = express.Router();
// import User from '../models/User.js';
// import bcrypt from 'bcryptjs';
// import jwt from 'jsonwebtoken';


// router.use((req, res, next) => {
//   console.log('🚨 Requisição chegou em /api/auth!');
//   next();
// });

// router.post('/login', async (req, res) => {
//    console.log('Body recebido:', req.body);
//   try {
//     const { email, senha } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(401).json({ msg: 'Usuário não encontrado' });

//     const isMatch = await bcrypt.compare(senha, user.senha);
//     if (!isMatch) return res.status(401).json({ msg: 'Senha incorreta' });

//     const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

//     res.json({ token });
//   } catch (err) {
//     console.error('Erro no login:', err);
//     res.status(500).json({ msg: 'Erro interno no login' });
//   }
// });

// // Rota de registro de novo usuário
// router.post('/register', async (req, res) => {
//   const { email, senha } = req.body;

//   if (!email || !senha) {
//     return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
//   }

//   const userExistente = await User.findOne({ email });
//   if (userExistente) {
//     return res.status(400).json({ msg: 'Usuário já existe.' });
//   }

//   const hash = await bcrypt.hash(senha, 10);

//   const novoUsuario = new User({
//     email,
//     senha: hash,
//   });

//   await novoUsuario.save();

//   res.status(201).json({ msg: 'Usuário criado com sucesso.' });
// });

// export default router;


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

export default router;