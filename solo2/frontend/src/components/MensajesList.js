import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MensajesList.css';

const MensajesList = ({ showNotification, messageSent }) => {
  const [mensajes, setMensajes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshed, setLastRefreshed] = useState(null);

  // Efecto para cargar mensajes al montar el componente
  useEffect(() => {
    fetchMensajes();
    
    // Establecer un intervalo para actualizar automáticamente si autoRefresh está activado
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchMensajes(false); // silent refresh (sin notificaciones)
      }, 10000); // Actualizar cada 10 segundos
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh]);
  
  // Efecto para actualizar cuando se envía un nuevo mensaje
  useEffect(() => {
    if (messageSent) {
      // Esperar un momento para dar tiempo a que el mensaje se guarde
      setTimeout(() => {
        fetchMensajes();
      }, 1500);
    }
  }, [messageSent]);

  const fetchMensajes = async (showNotifications = true) => {
    setLoading(true);
    setError(null);
    
    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      console.log('Cargando mensajes desde:', `${apiUrl}/mensajes`);
      
      const response = await axios.get(`${apiUrl}/mensajes`);
      console.log('Respuesta del servidor (mensajes):', response.data);
      
      // En caso de que la respuesta sea exitosa pero no tengamos un array
      if (!Array.isArray(response.data)) {
        console.warn('La respuesta del servidor no es un array:', response.data);
        if (showNotifications) {
          showNotification('Formato de respuesta inesperado', 'warning');
        }
        setMensajes([]);
      } else {
        // Ordenar mensajes por fecha, más recientes primero
        const mensajesOrdenados = [...response.data].sort((a, b) => 
          new Date(b.fecha) - new Date(a.fecha)
        );
        
        setMensajes(mensajesOrdenados);
        setLastRefreshed(new Date());
        
        // Si hay mensajes y showNotifications está activo, mostrar notificación
        if (showNotifications) {
          if (response.data.length > 0) {
            showNotification(`Se cargaron ${response.data.length} mensajes`, 'success');
          } else {
            showNotification('No hay mensajes para mostrar', 'info');
          }
        }
      }
      
      setDebugInfo({
        url: `${apiUrl}/mensajes`,
        responseStatus: response.status,
        responseData: response.data,
        timestamp: new Date().toISOString()
      });
      
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setError('No se pudieron cargar los mensajes enviados');
      if (showNotifications) {
        showNotification('Error al cargar mensajes', 'error');
      }
      
      setDebugInfo({
        url: `${(process.env.REACT_APP_API_URL || 'http://localhost:5000')}/mensajes`,
        error: error.message,
        errorResponse: error.response ? error.response.data : 'No response data',
        timestamp: new Date().toISOString()
      });
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha para mostrar en un formato legible
  const formatDate = (dateString) => {
    if (!dateString) return 'Fecha no disponible';
    
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    try {
      return new Date(dateString).toLocaleDateString('es-ES', options);
    } catch (e) {
      console.error('Error formateando fecha:', e);
      return 'Fecha inválida';
    }
  };

  // Función para enviar un correo de prueba y luego actualizar la lista
  const enviarCorreoDePrueba = async () => {
    try {
      setLoading(true);
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
      
      // Enviar un correo de prueba
      const response = await axios.post(`${apiUrl}/send-email`, {
        from: 'usuario.prueba@app.com',
        to: 'destinatario@example.com',
        subject: 'Correo de prueba',
        message: 'Este es un correo de prueba para verificar que el sistema de mensajes funcione correctamente.'
      });
      
      showNotification('Correo de prueba enviado correctamente', 'success');
      
      // Actualizar la lista inmediatamente
      fetchMensajes();
      
    } catch (error) {
      console.error('Error al enviar correo de prueba:', error);
      showNotification('Error al enviar correo de prueba', 'error');
      setLoading(false);
    }
  };

  // Alternar la actualización automática
  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
  };

  return (
    <div className="mensajes-container">
      <h2>Mensajes Enviados</h2>
      
      <div className="button-container">
        <button 
          onClick={() => fetchMensajes(true)} 
          className="refresh-button"
          disabled={loading}
        >
          {loading ? 'Cargando...' : 'Refrescar Mensajes'}
        </button>
        
        <button
          onClick={toggleAutoRefresh}
          className={`auto-refresh-button ${autoRefresh ? 'active' : ''}`}
        >
          {autoRefresh ? '🔄 Auto-refresh ON' : '⏸️ Auto-refresh OFF'}
        </button>
        
        <button 
          onClick={enviarCorreoDePrueba}
          className="test-button"
          disabled={loading}
        >
          Enviar Correo de Prueba
        </button>
      </div>

      {lastRefreshed && (
        <div className="last-refreshed">
          Última actualización: {formatDate(lastRefreshed)}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading-spinner">Cargando mensajes...</div>
      ) : mensajes && mensajes.length > 0 ? (
        <div className="mensajes-list">
          {mensajes.map((mensaje, index) => (
            <div key={index} className="mensaje-item">
              <div className="mensaje-header">
                <span className="mensaje-fecha">{formatDate(mensaje.fecha)}</span>
                <span className="mensaje-asunto">{mensaje.asunto || 'Sin asunto'}</span>
              </div>
              <div className="mensaje-users">
                <span className="mensaje-remitente">De: <strong>{mensaje.remitente || 'Remitente desconocido'}</strong></span>
                <span className="mensaje-destinatario">Para: <strong>{mensaje.destinatario || 'Destinatario desconocido'}</strong></span>
              </div>
              <div className="mensaje-contenido">
                {mensaje.mensaje || 'Sin contenido'}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="no-mensajes">
          <p>No hay mensajes enviados.</p>
          {debugInfo && (
            <div className="debug-section">
              <h4>Información de depuración:</h4>
              <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MensajesList;