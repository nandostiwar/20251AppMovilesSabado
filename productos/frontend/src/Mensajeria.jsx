import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function Mensajeria({ usuario, onLogout }) {
  const [telefonoMensaje, setTelefonoMensaje] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [mensajesRecibidos, setMensajesRecibidos] = useState([]);
  const [mensajeEnvio, setMensajeEnvio] = useState('');

  useEffect(() => {
    fetchMensajesRecibidos(usuario.telefono);
  }, [usuario]);

  const fetchMensajesRecibidos = async (telefono) => {
    try {
      const response = await axios.get(`${API_URL}/mensajes`);
      const mensajesFiltrados = response.data.filter(msg => msg.telefono === telefono);
      setMensajesRecibidos(mensajesFiltrados);
    } catch (error) {
      console.error('Error al obtener mensajes recibidos', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMensajeEnvio('');

    if (!telefonoMensaje.trim() || !mensaje.trim()) {
      setMensajeEnvio('Todos los campos son obligatorios');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/mensajes`, { telefono: telefonoMensaje, mensaje });
      setMensajeEnvio(response.data.message);
      setTelefonoMensaje('');
      setMensaje('');
    } catch (error) {
      setMensajeEnvio(error.response?.data?.error || 'Error al enviar mensaje');
    }
  };

  return (
    <div>
      <h3>Bienvenido, {usuario.nombre}</h3>
      <button onClick={onLogout}>Cerrar Sesión</button>

      <h2>Enviar Mensaje</h2>
      <form onSubmit={handleSendMessage}>
        <input type="text" placeholder="Teléfono Destinatario" value={telefonoMensaje} onChange={(e) => setTelefonoMensaje(e.target.value)} required />
        <input type="text" placeholder="Mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} required />
        <button type="submit">Enviar</button>
      </form>
      {mensajeEnvio && <p>{mensajeEnvio}</p>}

      <h3>Mensajes Recibidos</h3>
      {mensajesRecibidos.length > 0 ? (
        <ul>
          {mensajesRecibidos.map((msg, index) => (
            <li key={index}>{msg.mensaje}</li>
          ))}
        </ul>
      ) : (
        <p>No tienes mensajes</p>
      )}
    </div>
  );
}

export default Mensajeria;
