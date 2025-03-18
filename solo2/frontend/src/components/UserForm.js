import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserForm.css';

const UserForm = ({ showNotification, onValidEmail }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    mensaje: '' // Added mensaje field for email sending
  });
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debug, setDebug] = useState(''); // Para depuración
  const [emailValidated, setEmailValidated] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  const [isExistingEmail, setIsExistingEmail] = useState(false); // New state for existing emails
  const [showEmailForm, setShowEmailForm] = useState(false); // State to toggle email form

  useEffect(() => {
    // Cargar la lista de usuarios al montar el componente
    fetchUsuarios();
  }, []);

  const fetchUsuarios = async () => {
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.get(`${apiUrl}/usuarios`);
      setUsuarios(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      showNotification('Error al cargar la lista de usuarios', 'error');
    }
  };

  // Validar formato de email
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Check if email exists in the database
  const checkEmailAvailability = async (email) => {
    if (!email || !validateEmail(email)) {
      setIsEmailAvailable(false);
      setEmailValidated(false);
      setIsExistingEmail(false);
      return false;
    }
    
    // Check locally first to avoid unnecessary API calls
    const emailExists = usuarios.some(usuario => usuario.email === email);
    if (emailExists) {
      setIsEmailAvailable(false);
      setEmailValidated(true);
      setIsExistingEmail(true);
      
      // Notify the parent component
      if (onValidEmail) {
        onValidEmail(true);
      }
      
      return true;
    }
    
    setIsEmailAvailable(true);
    setEmailValidated(true);
    setIsExistingEmail(false);
    
    // Notify the parent component
    if (onValidEmail) {
      onValidEmail(true);
    }
    
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // If email field is being updated, validate it
    if (name === 'email') {
      checkEmailAvailability(value);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Limpiar mensaje de depuración
    setDebug('');
    
    // Validar formulario
    if (!formData.nombre || !formData.email) {
      showNotification('Nombre y email son requeridos', 'error');
      return;
    }

    // Validar formato de email
    if (!validateEmail(formData.email)) {
      showNotification('El formato del email no es válido', 'error');
      setEmailValidated(false);
      if (onValidEmail) onValidEmail(false);
      return;
    }

    setLoading(true);

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Enviando datos al servidor:', formData);
      
      // Hacer la petición al servidor
      const response = await axios.post(
        `${apiUrl}/usuarios`,
        formData
      );
      
      console.log('Respuesta del servidor:', response.data);
      showNotification('Usuario registrado correctamente!', 'success');
      
      // Limpiar formulario
      setFormData({ nombre: '', email: '' });
      
      // Actualizar la lista de usuarios
      fetchUsuarios();

      // Reset validation state
      setEmailValidated(false);
      setIsEmailAvailable(false);
      if (onValidEmail) onValidEmail(false);
      
    } catch (error) {
      console.error('Error detallado:', error);
      
      let errorMessage = 'Error al conectar con el servidor';
      
      if (error.response) {
        // El servidor respondió con un código de error
        console.log('Datos de respuesta de error:', error.response.data);
        
        errorMessage = error.response.data.error || 
                       `Error ${error.response.status}: ${error.response.statusText}`;
                       
        // Guardar información detallada para depuración
        setDebug(JSON.stringify(error.response.data, null, 2));
                       
        // Mensaje específico para email duplicado
        if (error.response.data.error ) {
          errorMessage = '❌ Este email ya está registrado en el sistema';
          setIsEmailAvailable(false);
          setEmailValidated(false);
          if (onValidEmail) onValidEmail(false);
        }
      } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
        setDebug('No se recibió respuesta del servidor');
      } else {
        setDebug(`Error: ${error.message}`);
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Handle email sending
  const handleSendEmail = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.mensaje) {
      showNotification('Email y mensaje son requeridos para enviar correo', 'error');
      return;
    }

    if (!validateEmail(formData.email)) {
      showNotification('El formato del email no es válido', 'error');
      return;
    }
    
    setLoading(true);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      const response = await axios.post(`${apiUrl}/send-email`, {
        from: formData.from || 'usuario@app.com',  // Añadir remitente
        to: formData.email,
        subject: `Mensaje para ${formData.nombre || 'usuario'}`,
        message: formData.mensaje
      });
      
      showNotification('Correo enviado correctamente!', 'success');
      setFormData({ ...formData, mensaje: '' });
      setShowEmailForm(false);
    } catch (error) {
      console.error('Error al enviar correo:', error);
      let errorMessage = 'Error al enviar el correo';
      
      if (error.response) {
        errorMessage = error.response.data.message || 'Error en el servidor';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  // Toggle email form visibility
  const toggleEmailForm = () => {
    setShowEmailForm(!showEmailForm);
  };

  return (
    <div className="email-form-container">
      <h2>Registro de Usuarios</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="nombre">Nombre:</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Ingrese su nombre"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Ingrese su correo electrónico"
            className={formData.email ? (isEmailAvailable ? 'valid-email' : isExistingEmail ? 'existing-email' : 'invalid-email') : ''}
          />
          {formData.email && !isEmailAvailable && !isExistingEmail && (
            <span className="email-validation-message">Este email no es válido</span>
          )}
          {formData.email && isEmailAvailable && (
            <span className="email-validation-success">Email disponible para registro</span>
          )}
          {formData.email && isExistingEmail && (
            <span className="email-validation-message">Este email ya está registrado. Puede enviar un correo.</span>
          )}
        </div>

        <div className="button-container">
          {isExistingEmail ? (
            <button 
              type="button"
              className="email-button"
              onClick={toggleEmailForm}
            >
              {showEmailForm ? 'Cancelar' : 'Enviar Correo'}
            </button>
          ) : (
            <button 
              type="submit" 
              className="send-button" 
              disabled={loading || !isEmailAvailable || !formData.nombre}
            >
              {loading ? 'Registrando...' : 'Registrar Usuario'}
            </button>
          )}
        </div>
      </form>

      {showEmailForm && isExistingEmail && (
        <form onSubmit={handleSendEmail} className="email-message-form">
          <div className="form-group">
            <label htmlFor="from">Tu correo (remitente):</label>
            <input
              type="email"
              id="from"
              name="from"
              value={formData.from || ''}
              onChange={handleChange}
              placeholder="tu@correo.com"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="mensaje">Mensaje:</label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              placeholder="Escriba su mensaje"
              rows="4"
              required
            ></textarea>
          </div>
          <button 
            type="submit"
            className="send-button"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Correo'}
          </button>
        </form>
      )}

      {debug && (
        <div className="debug-info">
          <h4>Información de depuración:</h4>
          <pre>{debug}</pre>
        </div>
      )}

      <div className="usuarios-list">
        <h3>Usuarios Registrados</h3>
        {usuarios.length > 0 ? (
          <ul>
            {usuarios.map((usuario, index) => (
              <li key={index}>
                <strong>{usuario.nombre}</strong> - {usuario.email}
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay usuarios registrados todavía.</p>
        )}
      </div>
    </div>
  );
};

export default UserForm;