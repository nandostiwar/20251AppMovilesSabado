const express = require('express')
const router = express.Router()
const { actualizarUser } = require('../controllers/userController')
const auth = require('../middleware/auth')

router.put('/:id', auth, actualizarUser)

module.exports = router
