const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, default: '' },
  category: { type: String, default: '' },
  duration: { type: String, default: '' },
  students: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  access: { type: Array, default: [] }, // Usuarios con acceso
});

module.exports = mongoose.model("Course", CourseSchema);
