import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function RegistroUsuario() {
  const [nombre, setNombre] = useState('');
  const [telefonoRegistro, setTelefonoRegistro] = useState('');
  const [mensajeRegistro, setMensajeRegistro] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setMensajeRegistro('');

    // Validar que los campos no estén vacíos
    if (!nombre.trim() || !telefonoRegistro.trim()) {
      setMensajeRegistro('Todos los campos son obligatorios');
      return;
    }

    try {
      console.log('📤 Enviando datos al backend:', { nombre, telefono: telefonoRegistro });

      // Enviar datos al backend
      const response = await axios.post(`${API_URL}/usuarios`, { nombre, telefono: telefonoRegistro });

      console.log('✅ Respuesta del backend:', response.data);
      
      setMensajeRegistro(response.data.message);
      setNombre('');
      setTelefonoRegistro('');
    } catch (error) {
      console.error('❌ Error en el registro:', error);
      setMensajeRegistro(error.response?.data?.error || 'Error al registrar usuario');
    }
  };

  return (
    <div>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Teléfono"
          value={telefonoRegistro}
          onChange={(e) => setTelefonoRegistro(e.target.value)}
          required
        />
        <button type="submit">Registrar</button>
      </form>
      {mensajeRegistro && <p>{mensajeRegistro}</p>}
    </div>
  );
}

export default RegistroUsuario;
