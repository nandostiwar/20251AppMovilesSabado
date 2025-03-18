const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Venta = require('./models/Venta');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Conexión a MongoDB
mongoose.connect('mongodb+srv://leandro1:3ylcIFwekoYIZScl@cluster1.gkvjv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
//3ylcIFwekoYIZScl
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
// Obtener todas las ventas
app.get('/api/ventas', async (req, res) => {
    try {
        const ventas = await Venta.find().sort({ fecha: -1 });
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear una nueva venta
app.post('/api/ventas', async (req, res) => {
    const venta = new Venta({
        nombre: req.body.nombre,
        producto: req.body.producto
    });

    try {
        const nuevaVenta = await venta.save();
        res.status(201).json(nuevaVenta);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
}); 