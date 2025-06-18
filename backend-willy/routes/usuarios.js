// routes/usuarios.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const upload = require("../middlewares/upload");
const auth = require("../middlewares/auth");  // Asegúrate de que auth esté correctamente importado
const userController = require("../controllers/userController");

// 🔒 GET: Obtener perfil del usuario logueado
router.get("/perfil", auth.isAuthenticated, userController.getProfile);

// 🔄 PUT: Actualizar perfil del usuario
router.put("/perfil", auth.isAuthenticated, upload.single("imagen"), userController.updateProfile);

module.exports = router;
