const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Usuario = require('../models/Usuario');

// Registro de usuario
router.post('/registro', async (req, res) => {
    try {
        const { nombre, email, password, rol } = req.body;
        
        // Validar campos requeridos
        if (!nombre || !email || !password) {
            return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
        }

        // Verificar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ mensaje: 'Formato de email inválido' });
        }

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ $or: [{ email }, { nombre }] });
        if (usuarioExistente) {
            if (usuarioExistente.email === email) {
                return res.status(400).json({ mensaje: 'El email ya está registrado' });
            }
            return res.status(400).json({ mensaje: 'El nombre de usuario ya está registrado' });
        }

        // Validar longitud de la contraseña
        if (password.length < 6) {
            return res.status(400).json({ mensaje: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Validar el rol
        const rolValido = rol === 'admin' || rol === 'usuario';
        if (!rolValido) {
            return res.status(400).json({ mensaje: 'Rol no válido' });
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario con el rol especificado
        const usuario = new Usuario({
            nombre,
            email,
            password: hashedPassword,
            rol: rol // Asignar el rol directamente desde la solicitud
        });

        await usuario.save();
        
        // Generar token
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123',
            { expiresIn: '1d' }
        );

        res.status(201).json({ 
            token, 
            usuario: { 
                id: usuario._id, 
                nombre, 
                email, 
                rol: usuario.rol 
            } 
        });
    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ mensaje: 'Error en el servidor: ' + error.message });
    }
});

// Login de usuario
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Verificar si el usuario existe
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password);
        if (!passwordValida) {
            return res.status(400).json({ mensaje: 'Credenciales inválidas' });
        }

        // Generar token
        const token = jwt.sign(
            { id: usuario._id, rol: usuario.rol },
            process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123',
            { expiresIn: '1d' }
        );

        res.json({ token, usuario: { id: usuario._id, nombre: usuario.nombre, email, rol: usuario.rol } });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ mensaje: 'Error en el servidor: ' + error.message });
    }
});

module.exports = router;