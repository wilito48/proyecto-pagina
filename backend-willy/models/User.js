const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    role: { type: String, default: 'user' }, // Puede ser 'admin' o 'user'
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }] // Cursos habilitados
});

module.exports = mongoose.model('User', UserSchema);
