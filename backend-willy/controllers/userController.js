const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("username email imageUrl");
    if (!user) return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    res.json({
      username: user.username,
      email: user.email,
      imageUrl: user.imageUrl,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error al obtener perfil" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { username, email, password } = req.body;
    const updateFields = {};
    if (username) updateFields.username = username;
    if (email) updateFields.email = email;
    if (password) updateFields.password = await bcrypt.hash(password, 10);
    if (req.file) updateFields.imageUrl = `/perfiles/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(userId, updateFields, { new: true });
    console.log("🔍 Respuesta del servidor:", {
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        username: user.username,
        email: user.email,
      },
      imageUrl: user.imageUrl,
    });
    res.json({
      success: true,
      message: "Perfil actualizado correctamente",
      user: {
        username: user.username,
        email: user.email,
      },
      imageUrl: user.imageUrl,
    });
  } catch (error) {
    console.error("❌ Error al actualizar perfil:", error);
    res.status(500).json({ success: false, message: "Error actualizando perfil" });
  }
}; 