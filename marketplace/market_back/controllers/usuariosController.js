const client = require('../db/database');
const { ObjectId } = require('mongodb');


const login = async (req, res) => {
    const { body } = req;
    const { username, password } = body;

    try {
        const db= client.db('marketplace')
        const collection= db.collection('Usuario')

    
        const usuario = await collection.findOne({ nombre: username, password: password });

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensaje: "Usuario no encontrado o contraseña incorrecta" });
        }
    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error al iniciar sesión' });
    }
};


const crearUsuario = async (req, res) => {
    const nuevoUsuario = req.body;
      
    try {
        const db= client.db('marketplace')
        const collection= db.collection('Usuario')
        const newUsuario = await collection.insertOne(nuevoUsuario);

        res.json({ mensaje: "Usuario creado" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ mensaje: "Error al crear el usuario" });
    }
};


const actualizarUsuario = async (req, res) => {
    const { id } = req.params;
    const nuevosDatosUsuario = req.body;

    try {
        const db = client.db('marketplace');
        const collection = db.collection('Usuario');
        const objectId = new ObjectId(id);
        const usuarioActualizacion = await collection.updateOne(
            { _id: objectId },
            { $set: nuevosDatosUsuario }
        );

        if (usuarioActualizacion.matchedCount === 1 && usuarioActualizacion.modifiedCount === 1) {
            res.json({ mensaje: "Usuarios actualizado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se encontró el Usuario para actualizar" });
        }
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).json({ mensaje: 'Error al actualizar el usuario' });
    }
};



const eliminarUsuario = async (req, res) => {
    const { id } = req.params;

    try {
        const db= client.db('marketplace')
        const collection= db.collection('Usuario')
        const objectId = new ObjectId(id);
        const usuarioEliminado = await collection.findOneAndDelete({ _id: objectId });

        if (usuarioEliminado) {
            res.json({ mensaje: "usuario eliminado correctamente" });
        } else {
            res.status(404).json({ mensaje: "No se ha encontrado el usuario" });
        }
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        res.status(500).json({ mensaje: 'Error al eliminar el usuario' });
    }
};



module.exports = {
    login,
    crearUsuario,
    actualizarUsuario,
    eliminarUsuario
}