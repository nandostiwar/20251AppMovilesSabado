const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 🔹 Reemplaza con tu URI de MongoDB Atlas
const MONGO_URI = 'mongodb+srv://enzoaguino01:pUWbZBMuIsB8YYUf@cluster0.g4gsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB Atlas'))
.catch(err => console.error('❌ Error al conectar a MongoDB Atlas:', err));
//SuDuxkihKoX6IvKN
// Definir esquema y modelo para Ventas
const ventaSchema = new mongoose.Schema({
  nombre: String,
  producto: String,
});

const Venta = mongoose.model('Venta', ventaSchema);

// Definir esquema y modelo para Usuarios
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  direccion: String,
  correo: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

// Ruta para crear una venta
app.post('/ventas', async (req, res) => {
  try {
    console.log('📩 Recibiendo datos:', req.body); // Ver qué datos llegan

    const { nombre, producto } = req.body;
    
    // Validar que los datos sean correctos
    if (!nombre || !producto) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const nuevaVenta = new Venta({ nombre, producto });
    await nuevaVenta.save();

    console.log('Venta guardada correctamente:', nuevaVenta);
    res.status(201).json(nuevaVenta);
  } catch (error) {
    console.error('Error en POST /ventas:', error);
    res.status(500).json({ error: error.message });
  }
});

// Ruta para obtener todas las ventas
app.get('/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

// Ruta para crear un usuario
app.post('/usuarios', async (req, res) => {
  try {
    console.log('📩 Recibiendo datos de usuario:', req.body);
    const { nombre, telefono, direccion, correo } = req.body;
    
    // Validar que los datos sean correctos
    if (!nombre || !telefono || !direccion || !correo) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    const nuevoUsuario = new Usuario({ nombre, telefono, direccion, correo });
    await nuevoUsuario.save();
    console.log('✅ Usuario guardado correctamente:', nuevoUsuario);
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error('Error en POST /usuarios:', error);
    res.status(500).json({ error: error.message });
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
const PORT = 5002;
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
