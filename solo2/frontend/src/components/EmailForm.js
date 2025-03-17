import React, { useState } from 'react';
import axios from 'axios';
import './EmailForm.css';

const EmailForm = ({ showNotification }) => {
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    if (!formData.to || !formData.subject || !formData.message) {
      showNotification('Todos los campos son requeridos', 'error');
      return;
    }

    setLoading(true);

    try {
      // Usar una URL de API con fallback por si la variable de entorno no está definida
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('URL de la API:', apiUrl);
      
      const response = await axios.post(
        `${apiUrl}/send-email`,
        formData
      );
      
      if (response.data.success) {
        showNotification('Email enviado correctamente!', 'success');
        // Limpiar formulario
        setFormData({ to: '', subject: '', message: '' });
      } else {
        showNotification('Error al enviar el email', 'error');
      }
    } catch (error) {
      console.error('Error detallado:', error);
      
      // Mostrar mensaje de error más específico
      let errorMessage = 'Error al conectar con el servidor';
      
      if (error.response) {
        // El servidor respondió con un código de estado fuera del rango de 2xx
        console.error('Respuesta de error:', error.response.data);
        errorMessage = error.response.data.message || 
                       `Error ${error.response.status}: ${error.response.statusText}`;
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        errorMessage = 'No se recibió respuesta del servidor';
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="email-form-container">
      <h2>Nuevo correo</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="to">Destinatario:</label>
          <input
            type="email"
            id="to"
            name="to"
            value={formData.to}
            onChange={handleChange}
            placeholder="correo@ejemplo.com"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="subject">Asunto:</label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Asunto del correo"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="message">Mensaje:</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Escribe tu mensaje aquí"
            rows="6"
          />
        </div>
        
        <button 
          type="submit" 
          className="send-button" 
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar correo'}
        </button>
      </form>
    </div>
  );
};

export default EmailForm;
