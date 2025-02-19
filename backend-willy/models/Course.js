const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  access: { type: Array, default: [] }, // Usuarios con acceso
});

module.exports = mongoose.model("Course", CourseSchema);
