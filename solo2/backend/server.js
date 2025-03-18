require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());
app.use(helmet());

// Verificar variables de entorno necesarias para JWT y Nodemailer
if (!process.env.SECRET_KEY) {
  console.error("❌ ERROR: SECRET_KEY no definida en el entorno");
  process.exit(1);
}
if (!process.env.MONGO_URI) {
  console.error("❌ ERROR: MONGO_URI no definida en el entorno");
  process.exit(1);
}
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  console.error("❌ ERROR: Credenciales de email no definidas en el entorno");
  process.exit(1);
}

const SECRET_KEY = process.env.SECRET_KEY;

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("✅ MongoDB conectado"))
  .catch((err) => {
    console.error("❌ Error al conectar MongoDB:", err);
    process.exit(1);
  });

/* ============================
   Esquemas y Modelos con Mongoose
=============================== */

// Modelo para Usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true }, // Cambiado de telefono a email
});
const Usuario = mongoose.model('Usuario', usuarioSchema);

// Modelo para Mensajes - Actualizado para incluir remitente y destinatario
const mensajeSchema = new mongoose.Schema({
  remitente: { type: String, required: true },
  destinatario: { type: String, required: true },
  asunto: { type: String, required: true },
  mensaje: { type: String, required: true },
  fecha: { type: Date, default: Date.now }
});
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

/* ============================
   Middleware de Autenticación JWT
=============================== */

const authMiddleware = (req, res, next) => {
  // Suponiendo que el token viene como "Bearer <token>"
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token inválido" });
  }
};

/* ============================
   Rutas de la API (Usuarios y Mensajes)
=============================== */

// Crear usuario (nombre y email)
app.post('/usuarios', async (req, res) => {
  try {
    const { nombre, email } = req.body;
    if (!nombre || !email) {
      return res.status(400).json({ error: '❌ Los campos nombre y email son obligatorios' });
    }
    
    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: '❌ El formato del email no es válido' });
    }
    
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ error: '❌ Ya existe un usuario registrado con este email' });
    }
    
    const nuevoUsuario = new Usuario({ nombre, email });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('❌ Error en POST /usuarios:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Crear un mensaje
app.post('/mensajes', async (req, res) => {
  try {
    const { remitente, destinatario, asunto, mensaje } = req.body;
    if (!remitente || !destinatario || !asunto || !mensaje) {
      return res.status(400).json({ error: '❌ Todos los campos son obligatorios' });
    }
    const nuevoMensaje = new Mensaje({ remitente, destinatario, asunto, mensaje });
    await nuevoMensaje.save();
    res.status(201).json(nuevoMensaje);
  } catch (error) {
    console.error('❌ Error en POST /mensajes:', error);
    res.status(500).json({ error: error.message });
  }
});

// Obtener todos los mensajes
app.get('/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.find();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

/* ============================
   Configuración de Nodemailer para Envío de Correos
=============================== */

// Mostrar estado de configuración de correo
console.log('EMAIL_USER está configurado:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS está configurado:', !!process.env.EMAIL_PASS);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Activa el modo de depuración
});

// Verificar conexión del transporter
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al verificar el transportador de correo:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

// Ruta para enviar email y guardar el mensaje
app.post('/send-email', async (req, res) => {
  try {
    const { from, to, subject, message } = req.body;
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }
    
    // Información de remitente y destinatario
    const remitente = from || process.env.EMAIL_USER;
    const destinatario = to;
    
    console.log('Intentando enviar correo a:', to);
    console.log('Datos completos:', { remitente, destinatario, asunto: subject, mensaje: message });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    // Enviar el email
    const info = await transporter.sendMail(mailOptions);
    console.log('Información del envío:', info);
    
    // Guardar el mensaje en la base de datos - Asegurando que los nombres de campos sean correctos
    const nuevoMensaje = new Mensaje({
      remitente,
      destinatario,
      asunto: subject,
      mensaje: message,
      fecha: new Date()  // Añadir fecha explícitamente
    });
    
    const mensajeGuardado = await nuevoMensaje.save();
    console.log('Mensaje guardado en la base de datos:', mensajeGuardado);
    
    // Verificamos que se guarde correctamente y devolvemos el mensaje guardado
    res.status(200).json({ 
      success: true, 
      message: 'Email enviado y guardado correctamente',
      mensajeId: mensajeGuardado._id
    });
  } catch (error) {
    console.error('Error al enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el email',
      error: error.message
    });
  }
});

/* ============================
   Iniciar el Servidor
=============================== */

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
});
