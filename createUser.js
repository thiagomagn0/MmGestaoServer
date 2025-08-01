const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('./models/User');

async function criarUsuario() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');

    const email = 'admin@exemplo.com';
    const senha = '123456'; // sua senha desejada

    const hash = await bcrypt.hash(senha, 10);

    const user = new User({ email, senha: hash });

    await user.save();
    console.log('Usuário criado com sucesso!');
    process.exit(0);
  } catch (error) {
    console.error('Erro:', error);
    process.exit(1);
  }
}

criarUsuario();