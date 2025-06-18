const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middlewares/auth');
const courseController = require('../controllers/courseController');

// 📌 Crear un curso (solo admin)
router.post('/crear', isAdmin, courseController.createCourse);

// 📌 Habilitar un curso para un usuario
router.post('/habilitar/:userId/:courseId', isAdmin, courseController.enableCourse);

// 📌 Obtener catálogo de cursos (público)
router.get('/catalogo', courseController.getAllCourses);

// 📌 Obtener detalles de un curso por id (público)
router.get('/:id', courseController.getCourseById);

module.exports = router;
