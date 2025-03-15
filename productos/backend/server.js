const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://jenytonuzco01:280999@cluster0.24m1h.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


// Definir esquema y modelo
const ventaSchema = new mongoose.Schema({
  nombre: String,
  producto: String
});

const usuarioSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
  domicilio: String,
  correo: String
});

const Venta = mongoose.model('Venta', ventaSchema);
const Usuario = mongoose.model('usuario', usuarioSchema);

// Ruta para crear una venta
app.post('/ventas', async (req, res) => {
  try {
    const { nombre, producto } = req.body;
    const nuevaVenta = new Venta({ nombre, producto });
    await nuevaVenta.save();
    res.status(201).json(nuevaVenta);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la venta' });
  }
});

//Ruta para crear cliente
app.post('/usuario', async (req, res) => {
  try {
    const { nombre, telefono, domicilio, correo } = req.body;
    const nuevoUsuario = new Usuario({ nombre, telefono, domicilio, correo });
    await nuevoUsuario.save();
    res.status(201).json(nuevoUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
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

// Ruta para obtener todos los clientes
app.get('/usuario', async (req, res) => {
  try {
    const usuario = await Usuario.find();
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios' });
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
