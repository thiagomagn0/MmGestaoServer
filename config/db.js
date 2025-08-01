import mongoose from 'mongoose';

require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB conectado');
  } catch (error) {
    console.error('Erro ao conectar MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;