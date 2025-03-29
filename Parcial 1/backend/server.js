// backend/server.js
require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(5000, () => console.log('Backend corriendo en puerto 5000'))
  })
  .catch(err => console.error('Error de conexión MongoDB:', err))
