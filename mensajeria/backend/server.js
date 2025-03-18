require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('MongoDB conectado'))
  .catch(err => console.error(err));

const userSchema = new mongoose.Schema({
    nombre: String,
    telefono: String,
    password: String
});

const messageSchema = new mongoose.Schema({
    sender: String,
    receiver: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Message = mongoose.model('Message', messageSchema);

// Ruta de registro
app.post('/register', async (req, res) => {
    const { nombre, telefono, password } = req.body;
    try {
        const user = new User({ nombre, telefono, password });
        await user.save();
        res.status(201).json({ message: 'Usuario registrado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al registrar' });
    }
});

// Ruta de login
app.post('/login', async (req, res) => {
    const { nombre, telefono } = req.body;
    try {
        const user = await User.findOne({ nombre, telefono });
        if (!user) return res.status(400).json({ error: 'Credenciales incorrectas' });
        res.json({ message: 'Login exitoso', user });
    } catch (err) {
        res.status(500).json({ error: 'Error en el login' });
    }
});

// Enviar mensaje
app.post('/send', async (req, res) => {
    const { sender, receiver, message } = req.body;
    try {
        const newMessage = new Message({ sender, receiver, message });
        await newMessage.save();
        res.status(201).json({ message: 'Mensaje enviado' });
    } catch (err) {
        res.status(500).json({ error: 'Error al enviar el mensaje' });
    }
});

// Obtener historial de mensajes por usuario
app.get('/messages/:nombre', async (req, res) => {
    try {
        const messages = await Message.find({ sender: req.params.nombre });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: 'Error al obtener los mensajes' });
    }
});
app.get("/messages/:user", async (req, res) => {
    try {
      const { user } = req.params;
  
      // Mensajes enviados por el usuario
      const sentMessages = await Message.find({ sender: user });
  
      // Mensajes recibidos por el usuario
      const receivedMessages = await Message.find({ receiver: user });
  
      res.json({ sentMessages, receivedMessages });
    } catch (err) {
      res.status(500).json({ error: "Error al obtener los mensajes" });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
