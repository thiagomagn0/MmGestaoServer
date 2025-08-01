import express from 'express';
const router = express.Router();
import Produto from '../models/Produto.js';
import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});


const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 1 * 1024 * 1024, // 1MB
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Apenas imagens são permitidas.'));
    }
    cb(null, true);
  }
});
router.get('/', async (req, res) => {
  try {
    const produtos = await Produto.find({ ativo: true }).sort({ createdAt: -1 });
    res.json(produtos);
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao listar produtos' });
  }
});
router.post('/', upload.single('imagem'), async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILE:', req.file);
    const { nome, preco, descricao } = req.body;
    const imagem = req.file ? req.file.filename : null;

    const produto = new Produto({ nome, preco: parseFloat(preco), descricao, imagem });
    await produto.save();
     res.status(201).json(produto); // Use return aqui!
  } catch (err) {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: 'Erro no upload da imagem', detalhe: err.message });
  }
  res.status(400).json({ error: 'Erro ao atualizar produto', detalhe: err.message });
}
});

// Atualizar produto
router.put('/:id', upload.single('imagem'), async (req, res) => {
  try {
    const { nome, preco, descricao } = req.body;
    const imagem = req.file ? req.file.filename : req.body.imagem;

    const update = { nome, preco: parseFloat(preco), descricao };
    if (imagem) update.imagem = imagem;

    const produto = await Produto.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!produto) {
      return res.status(404).json({ error: 'Produto não encontrado' });
    }

    res.status(200).json(produto);
  } catch (err) {
    console.error('Erro ao atualizar produto:', err);
    res.status(400).json({ error: 'Erro ao atualizar produto', detalhe: err.message });
  }
});
router.delete('/:id', async (req, res) => {
  try {
    await Produto.findByIdAndUpdate(req.params.id, { ativo: false });
    res.json({ msg: 'Produto desativado com sucesso' });
  } catch (err) {
    res.status(500).json({ msg: 'Erro ao desativar produto' });
  }
});

export default router;