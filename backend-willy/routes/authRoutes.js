const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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
router.post("/register", async (req, res) => {
  try {
      console.log("📩 Datos recibidos en el backend:", req.body);

      let { username, email, password } = req.body;

      // 🔴 Validación: Asegurar que los campos no estén vacíos o nulos
      if (!username || !email || !password) {
          return res.status(400).json({ error: "⚠️ Todos los campos son obligatorios" });
      }

      // 🔴 Validación: Verificar que el username no contenga solo espacios
      username = username.trim();
      if (username === "") {
          return res.status(400).json({ error: "⚠️ El nombre de usuario no puede estar vacío" });
      }

      // 🔴 Validación: Verificar si el username ya existe
      const existingUser = await User.findOne({ username });
      if (existingUser) {
          return res.status(400).json({ error: "⚠️ El nombre de usuario ya está en uso" });
      }

      // 🔴 Validación: Verificar si el email ya existe
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
          return res.status(400).json({ error: "⚠️ Este correo ya está registrado" });
      }

      // 🔵 Hashear la contraseña antes de guardarla
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // 🔵 Crear el usuario y guardarlo
      const newUser = new User({ username, email, password: hashedPassword });
      await newUser.save();

      console.log("✅ Usuario registrado correctamente:", newUser);
      res.json({ message: "✅ Usuario registrado correctamente" });

  } catch (err) {
      console.error("❌ Error en el servidor:", err);
      res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
});





// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Datos recibidos en login:", email, password);

  try {
    const user = await User.findOne({ email });
    console.log("🔍 Usuario encontrado en DB:", user); // <-- Agregado

    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log("🔑 Contraseña válida:", validPassword); // <-- Agregado

    if (!validPassword) {
      console.log("❌ Contraseña incorrecta");
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("✅ Token generado:", token); // <-- Agregado
    res.json({ message: "Login exitoso", token, username: user.username, email: user.email });

  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


// Ruta protegida para obtener datos del usuario
router.get("/protected", verificarToken, (req, res) => {
  res.json({ message: "Bienvenido al área protegida", username: req.user.username });
});

module.exports = router;
