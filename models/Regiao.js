import mongoose from 'mongoose';


const RegiaoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  taxaEntrega: { type: Number, required: true, default: 0 },
});

export default mongoose.model('Regiao', RegiaoSchema);
