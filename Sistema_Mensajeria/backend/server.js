// Backend: server.js (Node.js, Express, MongoDB)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();
const PORT = 5000;
const SECRET_KEY = "supersecret";

// Middleware
app.use(express.json());
app.use(cors());


// Conexión a MongoDB
mongoose.connect("mongodb+srv://sebastian:ZEOZiw5CZdHmkhzP@desarrollomovil.0jb9p.mongodb.net/messaging", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Modelos
const UserSchema = new mongoose.Schema({
  phone: { type: String, unique: true },
  password: String,
});
const MessageSchema = new mongoose.Schema({
  sender: String,
  receiver: String,
  message: String,
  timestamp: { type: Date, default: Date.now },
});
const User = mongoose.model("User", UserSchema);
const Message = mongoose.model("Message", MessageSchema);

// Registro
app.post("/register", async (req, res) => {
  const { phone, password } = req.body;
  const existingUser = await User.findOne({ phone });
  if (existingUser) {
    return res.status(400).json({ message: "El número ya está registrado" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ phone, password: hashedPassword });
  await user.save();
  res.json({ message: "Usuario registrado" });
});

// Inicio de sesión
app.post("/login", async (req, res) => {
  const { phone, password } = req.body;
  const user = await User.findOne({ phone });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }
  const token = jwt.sign({ phone: user.phone }, SECRET_KEY);
  res.json({ token });
});

// Enviar mensaje
app.post("/send", async (req, res) => {
  const { sender, receiver, message } = req.body;
  const newMessage = new Message({ sender, receiver, message });
  await newMessage.save();
  res.json({ message: "Mensaje enviado" });
});

// Obtener mensajes recibidos
app.get("/messages/:phone", async (req, res) => {
  const messages = await Message.find({ receiver: req.params.phone });
  res.json(messages);
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));