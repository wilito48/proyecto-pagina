const Course = require('../models/Course');
const User = require('../models/User');

exports.createCourse = async (req, res) => {
    try {
        const { title, description, price, image, category, duration, students, rating } = req.body;
        const course = new Course({ title, description, price, image, category, duration, students, rating });
        await course.save();
        res.json({ message: 'Curso creado exitosamente', course });
    } catch (error) {
        res.status(500).json({ error: 'Error al crear curso' });
    }
};

exports.enableCourse = async (req, res) => {
    try {
        const { userId, courseId } = req.params;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
        user.courses.push(courseId);
        await user.save();
        res.json({ message: 'Curso habilitado para el usuario' });
    } catch (error) {
        res.status(500).json({ error: 'Error al habilitar curso' });
    }
};

exports.getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({}, '-access'); // No enviar el array de acceso
        res.json(courses);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener cursos' });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id, '-access');
        if (!course) return res.status(404).json({ error: 'Curso no encontrado' });
        res.json(course);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el curso' });
    }
}; 