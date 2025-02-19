require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express(); // Inicializa Express

// ✅ Verifica que las variables de entorno existen
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: MONGO_URI o JWT_SECRET no están definidas en el .env");
  process.exit(1); // Detiene la ejecución si faltan variables
}

// 🌍 Configuración de CORS para permitir el frontend local
app.use(cors({ origin: "http://127.0.0.1:5500", credentials: true }));
app.use(express.json());

// 🔥 Conectar a MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Conectado a MongoDB Atlas"))
  .catch(err => {
    console.error("❌ Error al conectar a MongoDB", err);
    process.exit(1);
  });

// ✅ Importar rutas
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
app.use('/cursos', require('./routes/cursos')); // Rutas de cursos
app.use('/usuarios', require('./routes/usuarios')); // Rutas de usuarios

// 🔹 Servir archivos estáticos correctamente
app.use(express.static(path.join(__dirname, "public")));


// 🚀 Agregar la ruta protegida correctamente
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado. Token inválido." });
  }

  const token = authHeader.split(" ")[1]; // Extrae el token sin "Bearer"
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: decoded.username, message: "Acceso permitido" });
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
});

// 🔥 Iniciar el servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));
