const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Registro de Usuario
exports.register = async (req, res) => {
    const { name, email, password, role } = req.body;
  

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'El usuario ya se encuentra regstrado' });
        }

        user = new User({ name, email, password, role });

        // Cifrar la contraseña
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();


        res.status(201).json({ user: user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


// Login de Usuario
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'El usuario no se encuentra registrado' });
        }

        // Comparar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'La contraseña no concide con la regitrada en nuestro sistema' });
        }

        const response = {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }

        res.status(200).json(response);


    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
