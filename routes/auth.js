import express from 'express';
const router = express.Router();
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';



router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ msg: 'Usuário não encontrado' });

    const isMatch = await bcrypt.compare(senha, user.senha);
    if (!isMatch) return res.status(401).json({ msg: 'Senha incorreta' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.json({ token });
  } catch (err) {
    console.error('Erro no login:', err);
    res.status(500).json({ msg: 'Erro interno no login' });
  }
});

// Rota de registro de novo usuário
router.post('/register', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ msg: 'Email e senha são obrigatórios.' });
  }

  const userExistente = await User.findOne({ email });
  if (userExistente) {
    return res.status(400).json({ msg: 'Usuário já existe.' });
  }

  const hash = await bcrypt.hash(senha, 10);

  const novoUsuario = new User({
    email,
    senha: hash,
  });

  await novoUsuario.save();

  res.status(201).json({ msg: 'Usuário criado com sucesso.' });
});

export default router;