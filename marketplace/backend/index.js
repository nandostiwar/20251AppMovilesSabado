require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/dbConfig');
const salesRoutes = require('./routes/salesRoutes');
const usersRoutes = require('./routes/usersRoutes');


// Conectar a la base de datos
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

// Rutas
app.use('/api/v1/sales', salesRoutes);
app.use('/api/v1/users', usersRoutes);

// Ruta principal


app.get("/", (req, res) => {
    const htmlResponse = `
      <html>
        <head>
          <title>Marketplace API</title>
        </head>
        <body>
          <h1>Marketplace API</h1>
          <p>Bienvenido a la API de Marketplace</p>
        </body>
      </html>
    `;
    res.send(htmlResponse);
});



// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en el puerto ${PORT}`);
});
