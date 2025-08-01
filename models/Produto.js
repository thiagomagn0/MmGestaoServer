import mongoose from 'mongoose';


const ProdutoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  preco: { type: Number, required: true },
  descricao: String,
   imagem: String,
   ativo: { type: Boolean, default: true },
});


export default ongoose.model('Produto', ProdutoSchema);