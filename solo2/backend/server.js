require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Verificar que las variables de entorno estén disponibles
console.log('EMAIL_USER está configurado:', !!process.env.EMAIL_USER);
console.log('EMAIL_PASS está configurado:', !!process.env.EMAIL_PASS);

// Configuración del transporter de Nodemailer con mejor manejo de errores
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // Activa el modo de depuración
});

// Verificar la conexión del transporter
transporter.verify(function(error, success) {
  if (error) {
    console.error('Error al verificar el transportador de correo:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

// Ruta para enviar email
app.post('/send-email', async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    // Validación de los datos recibidos
    if (!to || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Todos los campos son obligatorios' 
      });
    }

    console.log('Intentando enviar correo a:', to);
    
    // Configuración del email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text: message,
    };

    // Envío del email con manejo más detallado de errores
    const info = await transporter.sendMail(mailOptions);
    console.log('Información del envío:', info);
    
    res.status(200).json({ 
      success: true, 
      message: 'Email enviado correctamente',
      info
    });
  } catch (error) {
    console.error('Error detallado al enviar email:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error al enviar el email',
      error: error.message
    });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
