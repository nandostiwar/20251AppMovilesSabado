const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGODB_URI)

const ventaSchema = new mongoose.Schema({
  nombre: String,
  producto: String,
  fecha: {
    type: Date,
    default: Date.now
  }
})

const clienteSchema = new mongoose.Schema({
  nombre: String,
  direccion: String,
  telefono: String,
  correo: String
})

const Venta = mongoose.model('Venta', ventaSchema)
const Cliente = mongoose.model('Cliente', clienteSchema)

app.post('/api/submit', async (req, res) => {
  try {
    const { nombre, direccion, telefono, correo, producto } = req.body
    
    await Cliente.findOneAndUpdate(
      { correo },
      { nombre, direccion, telefono, correo },
      { upsert: true, new: true }
    )
    
    const venta = new Venta({
      nombre,
      producto
    })
    await venta.save()
    
    res.status(200).json({ message: 'Datos guardados correctamente' })
  } catch (error) {
    console.error('Error al guardar datos:', error)
    res.status(500).json({ error: 'Error al procesar la solicitud' })
  }
})

app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find()
    res.status(200).json(clientes)
  } catch (error) {
    console.error('Error al obtener clientes:', error)
    res.status(500).json({ error: 'Error al procesar la solicitud' })
  }
})

app.get('/api/ventas', async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 })
    res.status(200).json(ventas)
  } catch (error) {
    console.error('Error al obtener ventas:', error)
    res.status(500).json({ error: 'Error al procesar la solicitud' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
}) 