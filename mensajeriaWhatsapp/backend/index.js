const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect('mongodb+srv://manuelcastro911:569DXHdubuI75eui@cluster.bn3dvuo.mongodb.net/app-mensajeria?retryWrites=true&w=majority&appName=Cluster');

// Definir esquemas y modelos
const usuarioSchema = new mongoose.Schema({
  nombre: String,
  telefono: String,
});

const mensajeSchema = new mongoose.Schema({
  origen: String,
  destino: String,
  mensaje: String,
});

const Usuario = mongoose.model('Usuario', usuarioSchema);
const Mensaje = mongoose.model('Mensaje', mensajeSchema);

// Rutas para Usuarios
app.post('/usuarios', async (req, res) => {
  const usuario = new Usuario(req.body);
  await usuario.save();
  res.status(201).send(usuario);
});

app.get('/usuarios', async (req, res) => {
  const usuarios = await Usuario.find();
  res.send(usuarios);
});

// Rutas para Mensajes
app.post('/mensajes', async (req, res) => {
  const mensaje = new Mensaje(req.body);
  await mensaje.save();
  res.status(201).send(mensaje);
});

app.get('/mensajes', async (req, res) => {
  const mensajes = await Mensaje.find();
  res.send(mensajes);
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
