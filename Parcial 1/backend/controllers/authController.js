const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// Registrar nuevo usuario o admin
exports.register = async (req, res) => {
  try {
    const { nombre, correo, contraseña, rol } = req.body

    // Verificar si ya existe un usuario con ese correo
    const usuarioExistente = await User.findOne({ correo })
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El correo ya está registrado' })
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(contraseña, 10)

    // Crear y guardar nuevo usuario
    const nuevoUsuario = new User({
      nombre,
      correo,
      contraseña: hashedPassword,
      rol: rol || 'usuario'
    })

    await nuevoUsuario.save()

    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error en el servidor' })
  }
}

// Login
exports.login = async (req, res) => {
  try {
    const { correo, contraseña } = req.body

    // Buscar usuario por correo
    const usuario = await User.findOne({ correo })
    if (!usuario) {
      return res.status(401).json({ error: 'Correo o contraseña inválidos' })
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(contraseña, usuario.contraseña)
    if (!passwordValida) {
      return res.status(401).json({ error: 'Correo o contraseña inválidos' })
    }

    // Generar token
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    )

    res.json({
      token,
      rol: usuario.rol,
      userId: usuario._id
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}
