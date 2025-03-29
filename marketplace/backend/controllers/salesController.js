const Sale = require('../models/Sale')

// Nueva venta
exports.storeVenta = async (req, res) => {
  try {
    const { usuario,valor, producto, nombre, cedula, telefono, tarjeta } = req.body;
    
    // Tarjeta predefinida para pruebas
    const TARJETA_VALIDA = {
      numero: "9858658998562541",
      vencimiento: "12/29",
      ccv: "596"
    };
   

    const estado = JSON.stringify(tarjeta) === JSON.stringify(TARJETA_VALIDA) 
      ? 'Aceptado' 
      : 'Declinado';

    const venta = new Sale({
      usuario,
      valor,
      producto,
      nombre,
      cedula,
      telefono,
      tarjeta,
      estado
    });

    await venta.save();
    res.status(200).json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar venta (admin)
exports.actualizarVenta = async (req, res) => {
  try {
    const venta = await Sale.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(venta);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener ventas por usuario
exports.getVentasUsuario = async (req, res) => {
  try {
    const ventas = await Sale.find({ usuario: req.params.id });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtener todas las ventas (admin)
exports.getAllVentas = async (req, res) => {
  try {
    const ventas = await Sale.find().populate('usuario', 'name email');
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};