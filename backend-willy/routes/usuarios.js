const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Middleware para verificar usuario autenticado
const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secreto_super_seguro');
        const user = await User.findById(decoded.id).populate('courses');

        if (!user) return res.status(401).json({ error: 'No autorizado' });

        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'No autorizado' });
    }
};

// 📌 Obtener cursos habilitados para el usuario
router.get('/mis-cursos', auth, async (req, res) => {
    res.json({ courses: req.user.courses });
});

module.exports = router;
