const fs = require('fs/promises');
const path = require('path');
const client = require('../db/database');
const { ObjectId } = require('mongodb');

// Tarjeta predefinida para validación
const TARJETA_PREDEFINIDA = {
    numero: '9858658998562541',
    fechaVencimiento: '12/29',
    ccv: '596'
};

const listarVentas = async (req, res) => {
    try {
        // Consultar todos los productos en la base de datos
        const db = client.db('marketplace')
        const collection = db.collection('Ventas')
        const ventas = await collection.find().toArray();
        res.json(ventas); // Enviar la lista de productos como respuesta
    } catch (error) {
        console.error('Error al obtener las ventas:', error);
        res.status(500).json({ mensaje: 'Error al obtener las ventas' });
    }
};

const nuevaVenta = async (req, res) => {
    try {
        const {
            nombre,
            cedula,
            telefono,
            numeroTarjeta,
            fechaVencimiento,
            ccv,
            producto,
            valor,
            usuario
        } = req.body;

        // Valido los campos
        if (
            !nombre ||
            !cedula ||
            !telefono ||
            !numeroTarjeta ||
            !fechaVencimiento ||
            !ccv ||
            !producto ||
            !valor
        ) {
            return res.status(400).json({
                mensaje: 'Todos los campos son requeridos'
            });
        }

        const db = client.db('marketplace');
        const collection = db.collection('Ventas');

        // Validar tarjeta predefinida
        if (
            numeroTarjeta !== TARJETA_PREDEFINIDA.numero ||
            fechaVencimiento !== TARJETA_PREDEFINIDA.fechaVencimiento ||
            ccv !== TARJETA_PREDEFINIDA.ccv
        ) {
            // Registrar la venta como "Rechazado"
            await collection.insertOne({
                usuario: usuario || 'usuario_anonimo',
                producto,
                valor: Number(valor),
                nombre,
                cedula,
                telefono,
                estado: 'Rechazado',
                fecha: new Date()
            });

            return res.status(400).json({
                mensaje: 'Datos de tarjeta inválidos. Por favor, intente nuevamente.'
            });
        } else {
            // Registrar la venta como "Aprobado"
            await collection.insertOne({
                usuario: usuario || 'usuario_anonimo',
                producto,
                valor: Number(valor),
                nombre,
                cedula,
                telefono,
                estado: 'Aprobado',
                fecha: new Date()
            });

            return res.json({ mensaje: "Pago procesado exitosamente" });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ mensaje: "Error al procesar el pago" });
    }
};

const actualizarVenta = async (req, res) => {
    const { id } = req.params;
    const nuevosDatosVentas = req.body;

    try {
        // Busca y actualiza el producto en la base de datos MongoDB
        const db = client.db('marketplace');
        const collection = db.collection('Ventas');
        const objectId = new ObjectId(id);
        const resultadoActualizacion = await collection.updateOne(
            { _id: objectId },
            { $set: nuevosDatosVentas }
        );

        if (resultadoActualizacion.matchedCount === 1 && resultadoActualizacion.modifiedCount === 1) {
            res.json({ mensaje: "Venta actualizada correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se encontró la venta para actualizar" });
        }
    } catch (error) {
        console.error('Error al actualizar la venta:', error);
        res.status(500).json({ mensaje: 'Error al actualizar la venta' });
    }
};

module.exports = {
    nuevaVenta,
    actualizarVenta,
    listarVentas
}