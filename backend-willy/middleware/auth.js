const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports.isAdmin = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secreto_super_seguro'); // Usa una clave segura
        const user = await User.findById(decoded.id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ error: 'Acceso denegado. Solo administradores' });
        }

        req.user = user; // Guardamos el usuario en la petición
        next();
    } catch (error) {
        res.status(401).json({ error: 'No autorizado' });
    }
};
