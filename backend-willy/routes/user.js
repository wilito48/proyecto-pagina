// routes/user.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const upload = require('../middlewares/upload');
const User = require('../models/User'); // tu modelo de usuario
const auth = require('../middlewares/auth'); // middleware para verificar sesión

router.put('/profile', auth, upload.single('profileImage'), async (req, res) => {
  try {
    const userId = req.user.id; // viene del middleware auth
    const { username, email, password } = req.body;

    const updateData = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (req.file) updateData.profileImage = req.file.filename;

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, { new: true });

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Error actualizando perfil' });
  }
});

module.exports = router;
