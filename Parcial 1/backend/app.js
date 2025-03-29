const express = require('express')
const cors = require('cors')
const app = express()

const authRoutes = require('./routes/authRoutes')
const ventaRoutes = require('./routes/ventaRoutes')
const userRoutes = require('./routes/userRoutes')

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/ventas', ventaRoutes)
app.use('/api/users', userRoutes)

module.exports = app
