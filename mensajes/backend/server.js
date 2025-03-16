const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://lina:Prom2019..@cluster0.x0bmpcy.mongodb.net/Mensajeria?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a la base de datos"))
.catch(err => console.error("❌ Error al conectar a la base de datos:", err.message));

// Definir esquema y modelo para la colección "mensajes"
const mensajesSchema = new mongoose.Schema({
  origen: { type: String, required: true },
  destino: { type: String, required: true },
  mensaje: { type: String, required: true }
});

const Mensaje = mongoose.model('Mensaje', mensajesSchema);

// Definir esquema y modelo para la colección "usuarios"
const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para registrar un usuario
app.post('/usuario', async (req, res) => {
  try {
    const { nombre, telefono } = req.body;

    if (!nombre || !telefono) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ telefono });
    if (usuarioExistente) {
      return res.status(400).json({ error: "Este número de teléfono ya está registrado" });
    }

    // Guardar nuevo usuario
    const nuevoUsuario = new Usuario({ nombre, telefono });
    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario registrado exitosamente", usuario: nuevoUsuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
  }
});

// Ruta para enviar un mensaje
app.post('/mensaje', async (req, res) => {
  try {
    const { origen, destino, mensaje } = req.body;

    if (!origen || !destino || !mensaje) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Verificar que tanto el origen como el destino sean usuarios registrados
    const origenExiste = await Usuario.findOne({ telefono: origen });
    const destinoExiste = await Usuario.findOne({ telefono: destino });

    if (!origenExiste || !destinoExiste) {
      return res.status(400).json({ error: "El número de origen o destino no está registrado" });
    }

    const nuevoMensaje = new Mensaje({ origen, destino, mensaje });
    await nuevoMensaje.save();

    res.status(201).json({ mensaje: "Mensaje enviado exitosamente", datos: nuevoMensaje });
  } catch (error) {
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// Ruta para obtener todos los mensajes
app.get('/mensajes', async (req, res) => {
  try {
    const mensajes = await Mensaje.find();
    res.json(mensajes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los mensajes' });
  }
});

// Ruta para obtener todos los usuarios
app.get('/usuarios', async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
