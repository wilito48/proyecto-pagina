// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRETO';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Verificar si el usuario es admin
    const user = await User.findById(decoded.id);  // Usa el ID decodificado del token
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    next(); // Si es admin, continúa con la siguiente función
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  const JWT_SECRET = process.env.JWT_SECRET || 'TU_SECRETO';

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
