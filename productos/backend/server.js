const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://lina:Prom2019..@cluster0.x0bmpcy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Conectado a MongoDB Atlas"))
.catch(err => console.error("❌ Error conectando a MongoDB:", err.message));

// Definir esquema y modelo para la colección "ventas"
const ventaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  producto: { type: String, required: true }
});

const Venta = mongoose.model('Venta', ventaSchema);

// Definir esquema y modelo para la colección "clientes"
const clienteSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  direccion: { type: String, required: true },
  correo: { type: String, required: true }
});

const Cliente = mongoose.model('Cliente', clienteSchema);

// Ruta para crear una venta y guardar datos del cliente en otra colección
app.post('/ventas', async (req, res) => {
  try {
    const { nombre, producto, telefono, direccion, correo } = req.body;

    if (!nombre || !producto || !telefono || !direccion || !correo) {
      return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    // Guardar en la colección "ventas"
    const nuevaVenta = new Venta({ nombre, producto });
    await nuevaVenta.save();

    // Guardar en la colección "clientes"
    const nuevoCliente = new Cliente({ nombre, telefono, direccion, correo });
    await nuevoCliente.save();

    res.status(201).json({ venta: nuevaVenta, cliente: nuevoCliente });
  } catch (error) {
    res.status(500).json({ error: 'Error al procesar la solicitud' });
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
app.get('/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los clientes' });
  }
});

// Iniciar servidor
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en el puerto ${PORT}`));
