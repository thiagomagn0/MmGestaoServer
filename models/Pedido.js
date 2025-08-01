import mongoose from 'mongoose';

const PedidoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  produtos: [
    {
      produto: { type: mongoose.Schema.Types.ObjectId, ref: 'Produto', required: true },
      nome: { type: String, required: true }, // ← nome salvo na época do pedido
      quantidade: { type: Number, required: true },
      preco: { type: Number, required: true } // ← preço salvo na época do pedido
    }
  ],
  total: { type: Number, required: true },
  data: { type: Date, default: Date.now }
});

export default mongoose.model('Pedido', PedidoSchema);