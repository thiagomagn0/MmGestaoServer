import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const authMiddleware = (req, res, next) =>{
  // Tentar pegar o header Authorization, tanto maiúsculo quanto minúsculo
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];

  if (!authHeader) return res.status(401).json({ msg: 'Token não encontrado' });

  // Espera formato "Bearer token"
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : null;
  if (!token) return res.status(401).json({ msg: 'Token não encontrado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token inválido' });
  }
};

export default authMiddleware;