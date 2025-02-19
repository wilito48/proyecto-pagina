const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { isAdmin } = require('../middleware/auth');

// 📌 Crear un curso (solo admin)
router.post('/crear', isAdmin, async (req, res) => {
    try {
        const { title, description, price } = req.body;
        const course = new Course({ title, description, price });
        await course.save();
        res.json({ message: 'Curso creado exitosamente', course });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear curso' });
    }
});

// 📌 Habilitar un curso para un usuario
router.post('/habilitar/:userId/:courseId', isAdmin, async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        

        user.courses.push(courseId);
        await user.save();
        res.json({ message: 'Curso habilitado para el usuario' });
    } catch (error) {
        res.status(500).json({ error: 'Error al habilitar curso' });
    }
});

module.exports = router;
