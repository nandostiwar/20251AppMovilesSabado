const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 📌 REGISTRO DE USUARIO
router.post("/register", async (req, res) => {
  try {
    console.log("📌 Datos recibidos:", req.body); // <-- Agregar log para ver qué recibe
    
    const { nombre, correo, password, rol } = req.body;

    if (!nombre || !correo || !password || !rol) {
      console.log("❌ Faltan datos en la solicitud");
      return res.status(400).json({ msg: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await User.findOne({ correo });
    if (usuarioExistente) {
      console.log("⚠️ El correo ya está registrado");
      return res.status(400).json({ msg: "El correo ya está registrado" });
    }

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const nuevoUsuario = new User({ nombre, correo, password: passwordHash, rol });
    await nuevoUsuario.save();
    
    console.log("✅ Usuario registrado correctamente");
    res.status(201).json({ msg: "Usuario registrado exitosamente" });

  } catch (error) {
    console.error("❌ Error en /register:", error); // <-- Log detallado
    res.status(500).json({ msg: "Error en el servidor", error: error.message });
  }
});


// 📌 LOGIN DE USUARIO
router.post('/login', async (req, res) => {
  const { correo, password } = req.body;

  try {
      const user = await User.findOne({ correo });
      if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

      const token = jwt.sign(
          { id: user._id, rol: user.rol }, // ✅ Incluir el rol en el token
          process.env.JWT_SECRET,
          { expiresIn: '4h' }
      );

      res.json({ msg: 'Login exitoso', token, rol: user.rol }); // ✅ Enviar el rol en la respuesta
  } catch (err) {
      res.status(500).json({ msg: 'Error en el servidor' });
  }
});



module.exports = router;
