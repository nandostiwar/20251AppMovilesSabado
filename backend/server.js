const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Conexión a MongoDB
mongoose.connect('mongodb://localhost:27017/miBaseDeDatos')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error conectando a MongoDB:', err));

// Ruta para la raíz
app.get('Bienvenido a tu App', (req, res) => {
    res.send('¡Bienvenido a mi aplicación!');
});

// Rutas de la API
const ventaRoutes = require('./routes/ventaRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
app.use('/api/ventas', ventaRoutes);
app.use('/api/clientes', clienteRoutes);

// Iniciar el servidor
app.listen(PORT, () => {    
    console.log(`Servidor corriendo en http://localhost:${3000}`);
});
app.use(express.static('public'));