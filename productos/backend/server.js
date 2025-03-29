const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());


mongoose.connect('mongodb+srv://jorgeborrero01:zm3iosnQOtooUTzV@cluster0.zjo0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

/*// Conexión a MongoDB
mongoose.connect('mongodb+srv://jorgeborrero01:aw4fD2k0wglCTDY0@cluster0.zjo0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});*/


// Definir esquema y modelo
const ventaSchema = new mongoose.Schema({
  nombre: String,
  producto: String
});

const Venta = mongoose.model('Venta', ventaSchema);

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

// Ruta para obtener todas las ventas
app.get('/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find();
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las ventas' });
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));
