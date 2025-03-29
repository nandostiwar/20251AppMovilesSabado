const Venta = require('../models/Venta')
const User = require('../models/User')

const TARJETA_VALIDA = {
  numero: '1234123412341234',
  vencimiento: '12/25',
  ccv: '123'
}

exports.nuevaVenta = async (req, res) => {
  const { valor, producto, nombre, cedula, telefono, tarjeta, vencimiento, ccv, userId } = req.body

  const estado = (tarjeta === TARJETA_VALIDA.numero &&
                  vencimiento === TARJETA_VALIDA.vencimiento &&
                  ccv === TARJETA_VALIDA.ccv) ? 'Aceptado' : 'Declinado'

  const venta = new Venta({
    valor, producto, nombre, cedula, telefono,
    tarjeta, vencimiento, ccv,
    usuario: userId,
    estado
  })

  await venta.save()
  res.status(201).json({ message: 'Venta registrada', estado })
}

exports.obtenerVentasUsuario = async (req, res) => {
  const { userId } = req.params
  const ventas = await Venta.find({ usuario: userId }).sort({ fecha: -1 })
  res.json(ventas)
}

exports.actualizarVenta = async (req, res) => {
  const { ventaId, estado } = req.body
  const venta = await Venta.findByIdAndUpdate(ventaId, { estado }, { new: true })
  res.json(venta)
}

exports.obtenerTodasVentas = async (req, res) => {
  const ventas = await Venta.find().populate('usuario', 'nombre correo').sort({ fecha: -1 })
  res.json(ventas)
}
