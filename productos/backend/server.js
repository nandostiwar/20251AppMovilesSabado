const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb+srv://estebanmunoz03:CSKqcWG6knNzOEuR@cluster0.oyrru.mongodb.net/tienda?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('Conectado a MongoDB')).catch(err => console.error('Error al conectar a MongoDB:', err));

const ClienteSchema = new mongoose.Schema({
  nombre: String,
  email: String,
  telefono: String
});
const Cliente = mongoose.model('Cliente', ClienteSchema);

const ProductoSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String,
  precio: Number,
  stock: Number
});
const Producto = mongoose.model('Producto', ProductoSchema);

const VentaSchema = new mongoose.Schema({
  nombre: String,
  producto: { type: mongoose.Schema.Types.ObjectId, ref: 'Producto' }
});
const Venta = mongoose.model('Venta', VentaSchema);

// Rutas de Clientes
app.post('/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).send(cliente);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/clientes', async (req, res) => {
  const clientes = await Cliente.find();
  res.send(clientes);
});

// Rutas de Productos
app.post('/productos', async (req, res) => {
  try {
    const producto = new Producto(req.body);
    await producto.save();
    res.status(201).send(producto);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/productos', async (req, res) => {
  const productos = await Producto.find();
  res.send(productos);
});

// Rutas de Ventas
app.post('/ventas', async (req, res) => {
  try {
    const producto = await Producto.findById(req.body.producto);
    if (!producto) {
      return res.status(400).send({ error: 'Producto no encontrado' });
    }
    if (producto.stock <= 0) {
      return res.status(400).send({ error: 'Producto sin stock' });
    }
    
    producto.stock -= 1;
    await producto.save();
    
    const venta = new Venta({ nombre: req.body.nombre, producto: req.body.producto });
    await venta.save();
    res.status(201).send(venta);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get('/ventas', async (req, res) => {
  const ventas = await Venta.find().populate('producto');
  res.send(ventas);
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
