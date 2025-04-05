const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { nombre, correo, password, rol } = req.body;
        const userExists = await User.findOne({ correo });
        if (userExists) return res.status(400).json({ msg: "Correo ya registrado" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({ nombre, correo, password: hashedPassword, rol });
        await user.save();

        app.post("/api/auth/register", async (req, res) => {
            console.log("Datos recibidos:", req.body); // Verifica los datos recibidos
        
            try {
                // Código de registro...
            } catch (error) {
                console.error("Error en el registro:", error); // Muestra errores en la terminal
                res.status(500).json({ message: "Error en el servidor" });
            }
        });
        

        res.status(201).json({ msg: "Usuario registrado exitosamente" });
    } catch (error) {
        res.status(500).json({ msg: "Error en el servidor" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { correo, password } = req.body;
        console.log("📩 Datos recibidos:", { correo, password });

        const user = await User.findOne({ correo });
        if (!user) {
            console.log("❌ Usuario no encontrado");
            return res.status(400).json({ msg: "Usuario no encontrado" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("❌ Contraseña incorrecta");
            return res.status(400).json({ msg: "Contraseña incorrecta" });
        }

        if (!user.rol) {
            console.log("⚠️ Error: usuario sin rol definido en la base de datos");
            return res.status(500).json({ msg: "Error: usuario sin rol definido" });
        }

        const token = jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: "1d" });

        console.log("✅ Token generado:", token);
        console.log("✅ Usuario autenticado:", { id: user._id, nombre: user.nombre, rol: user.rol });

        res.json({
            token,
            user: {
                id: user._id,
                nombre: user.nombre,
                correo: user.correo,
                rol: user.rol
            }
        });

    } catch (error) {
        console.error("❌ Error en el servidor:", error);
        res.status(500).json({ msg: "Error en el servidor" });
    }
};
