const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const authController = require("../controllers/authController");
const auth = require('../middlewares/auth');

const router = express.Router();

// Middleware para verificar el token
const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(403).json({ error: "Acceso denegado" });

  const token = authHeader.split(" ")[1]; // Extraer el token del header
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Token inválido o expirado" });
    req.user = decoded; // Guardamos los datos del usuario en la request
    next();
  });
};

// Registro
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Obtener usuario autenticado
router.get("/me", auth.isAuthenticated, authController.me);

// Ruta protegida para obtener datos del usuario
router.get("/protected", verificarToken, authController.protected);

module.exports = router;
