const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    console.log("📩 Datos recibidos en el backend:", req.body);
    let { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "⚠️ Todos los campos son obligatorios" });
    }
    username = username.trim();
    if (username === "") {
      return res.status(400).json({ error: "⚠️ El nombre de usuario no puede estar vacío" });
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "⚠️ El nombre de usuario ya está en uso" });
    }
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "⚠️ Este correo ya está registrado" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    console.log("✅ Usuario registrado correctamente:", newUser);
    res.json({ message: "✅ Usuario registrado correctamente", username: newUser.username, email: newUser.email });
  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    res.status(500).json({ error: "Error interno del servidor", details: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log("📩 Datos recibidos en login:", email, password);
  try {
    const user = await User.findOne({ email });
    console.log("🔍 Usuario encontrado en DB:", user);
    if (!user) {
      console.log("❌ Usuario no encontrado");
      return res.status(400).json({ error: "Usuario no encontrado" });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    console.log("🔑 Contraseña válida:", validPassword);
    if (!validPassword) {
      console.log("❌ Contraseña incorrecta");
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    console.log("✅ Token generado:", token);
    res.json({ message: "Login exitoso", token, username: user.username, email: user.email });
  } catch (err) {
    console.error("❌ Error en el servidor:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

exports.protected = (req, res) => {
  res.json({ message: "Bienvenido al área protegida", username: req.user.username });
};

exports.me = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('username email imageUrl role');
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
      role: user.role
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
}; 