import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  telefone: String,  
  endereco: String,
  regiao: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Regiao'
  }
});

const Cliente = mongoose.model('Cliente', ClienteSchema);

export default Cliente;