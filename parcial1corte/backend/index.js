require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const authRoutes = require('./routes/authRoutes');
const ventaRoutes = require('./routes/ventaRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check endpoint
app.get('/api/health-check', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/marketplace')
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// JWT Middleware
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ mensaje: 'Acceso denegado' });
    }

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET || 'tu_clave_secreta_super_segura_123');
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ mensaje: 'Token inválido' });
    }
};

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ventas', verificarToken, ventaRoutes);

const PORT = process.env.PORT || 5000;

// Función para intentar iniciar el servidor en diferentes puertos
const startServer = (port) => {
    try {
        app.listen(port, () => {
            console.log(`Servidor corriendo en puerto ${port}`);
            // Actualizar el archivo .env con el nuevo puerto si es diferente al original
            if (port !== 5000) {
                console.log(`Note: Using alternative port ${port}. Update your frontend API_URL if needed.`);
            }
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.log(`Puerto ${port} en uso, intentando con puerto ${port + 1}...`);
                startServer(port + 1);
            } else {
                console.error('Error al iniciar el servidor:', err);
            }
        });
    } catch (error) {
        console.error('Error al iniciar el servidor:', error);
    }
};

// Iniciar el servidor
startServer(PORT);