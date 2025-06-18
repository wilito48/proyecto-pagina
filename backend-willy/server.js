require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const User = require("./models/User");


const UserSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    isAdmin: { type: Boolean, default: false },
    profileImage: String, // nombre de archivo de la imagen
    role: { type: String, default: "user" },
    courses: { type: Array, default: [] },
    imageUrl: { type: String, default: "" }
}, { timestamps: true });

module.exports.isAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, 'TU_SECRETO'); // usa tu secreto real
    req.user = decoded;

    // Verificar si el usuario es admin
    const user = await User.findById(decoded.id);  // Usa el ID decodificado del token
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'No tienes permisos de administrador' });
    }

    next(); // Si es admin, continúa con la siguiente función
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

module.exports.isAuthenticated = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, 'TU_SECRETO'); // usa tu secreto real
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};

const app = express();
app.use(express.json());

// CORS solo desde tu frontend
app.use(cors({
  origin: "http://127.0.0.1:5500",
  credentials: true
}));

// Verificar variables de entorno críticas
if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("❌ ERROR: MONGO_URI o JWT_SECRET no están definidas en el .env");
  process.exit(1);
}

// Conectar a MongoDB Atlas
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => {
  console.error("❌ Error al conectar a MongoDB", err);
  process.exit(1);
});

// 📁 Rutas estáticas
// Archivos HTML, CSS, JS del frontend
app.use("/public", express.static(path.join(__dirname, "public")));

// Imagenes de perfil (esto es CLAVE para que funcionen las URLs tipo /perfiles/imagen.jpg)
app.use("/perfiles", express.static(path.join(__dirname, "uploads/perfiles")));

// Servir imágenes de cursos desde /imagen
app.use("/imagen", express.static(path.join(__dirname, "../imagen")));

// 🛠️ Rutas de tu API
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/usuarios", require("./routes/usuarios")); // <- Esta es la ruta para PUT /perfil
app.use("/api/cursos", require("./routes/cursos")); // Si tienes otros endpoints


// Ruta protegida de prueba
app.get("/api/protected", (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Acceso denegado. Token inválido." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ username: decoded.username, message: "Acceso permitido" });
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado." });
  }
});

// 🟢 Arrancar servidor
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`));


