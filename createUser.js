import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
dotenv.config();
import User from './models/User';

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