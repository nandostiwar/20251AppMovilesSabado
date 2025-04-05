const Venta = require("../models/Venta");

// Tarjeta predefinida
const TARJETA_PREDEFINIDA = {
  numero: "9858658998562541",
  fecha: "12/49",
  ccv: "596",
};

const nuevaVenta = async (req, res) => {
  try {
    console.log("Datos recibidos en el backend:", req.body);
  // ✅ Primero desestructuramos los valores del cuerpo
  let { valor, producto, nombre, cedula, telefono, tarjeta, fecha, ccv } = req.body;

    // ✅ Convertimos valor a número
    valor = Number(valor);

 // ✅ Luego validamos que todos los campos existan
 if (
  !valor ||
  !producto ||
  !nombre ||
  !cedula ||
  !telefono ||
  !tarjeta ||
  !fecha ||
  !ccv
) {
  return res.status(400).json({ msg: "Faltan datos en la solicitud." });
}

    if (!valor || !producto || !nombre || !cedula || !telefono || !tarjeta || !fecha || !ccv) {
      return res.status(400).json({ msg: "Faltan datos en la solicitud." });
    }

    if (
      tarjeta !== TARJETA_PREDEFINIDA.numero ||
      fecha !== TARJETA_PREDEFINIDA.fecha ||
      ccv !== TARJETA_PREDEFINIDA.ccv
    ) {
      return res.status(400).json({ 
        msg: "Compra declinada. Datos de tarjeta incorrectos.",
        tarjetaRecibida: tarjeta,
        tarjetaEsperada: TARJETA_PREDEFINIDA.numero,
        fechaRecibida: fecha,
        fechaEsperada: TARJETA_PREDEFINIDA.fecha,
        cvvRecibido: ccv,
        ccvEsperado: TARJETA_PREDEFINIDA.ccv
      });
    }

    const nuevaVenta = new Venta({
      valor,
      producto,
      nombre,
      cedula,
      telefono,
      tarjeta,
      ccv,
      estado: "Pendiente",
      fecha: new Date(),
    });

    await nuevaVenta.save();
    res.status(201).json({ msg: "Venta registrada correctamente", estado: "Pendiente" });

  } catch (error) {
    console.error("Error en el backend:", error);
    res.status(500).json({ msg: "Error al registrar la venta" });
  }
};


const obtenerVentas = async (req, res) => {
  try {
    const ventas = await Venta.find().sort({ fecha: -1 });
    res.json(ventas);
  } catch (error) {
    res.status(500).json({ mensaje: "Error obteniendo ventas" });
  }
};

const actualizarVenta = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  try {
    const venta = await Venta.findByIdAndUpdate(id, { estado }, { new: true });
    if (!venta) return res.status(404).json({ mensaje: "Venta no encontrada" });

    res.json(venta);
  } catch (error) {
    res.status(500).json({ mensaje: "Error actualizando la venta" });
  }
};

module.exports = {
  obtenerVentas,
  actualizarVenta
};


// Exportar todas las funciones correctamente
module.exports = { nuevaVenta, obtenerVentas, actualizarVenta };
