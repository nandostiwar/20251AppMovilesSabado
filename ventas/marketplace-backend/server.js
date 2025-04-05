const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");
const ventasRoutes = require("./routes/ventasRoutes");
require("dotenv").config();

dotenv.config();
const app = express();

// Middleware
app.use(express.json()); // Asegura que el servidor pueda procesar JSON
app.use(cors());

// Rutas
app.use("/api/ventas", require("./routes/ventasRoutes"));

// Conexión a MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://enzoaguino01:8YmCQODrFcEienUt@cluster0.g4gsp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ Conectado a MongoDB"))
  .catch((err) => console.error("❌ Error al conectar a MongoDB:", err));

// Rutas  
app.use("/api/auth", authRoutes);
app.use("/api/ventas", ventasRoutes);

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Servidor corriendo en puerto ${PORT}`));
