import React, { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function LoginUsuario({ onLoginSuccess }) {
  const [telefonoLogin, setTelefonoLogin] = useState('');
  const [mensajeLogin, setMensajeLogin] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setMensajeLogin('');

    if (!telefonoLogin.trim()) {
      setMensajeLogin('El teléfono es obligatorio');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/usuarios/login`, { telefono: telefonoLogin });
      onLoginSuccess(response.data.usuario);
      setMensajeLogin(response.data.message);
      setTelefonoLogin('');
    } catch (error) {
      setMensajeLogin(error.response?.data?.error || 'Error al iniciar sesión');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="Teléfono" value={telefonoLogin} onChange={(e) => setTelefonoLogin(e.target.value)} required />
        <button type="submit">Iniciar Sesión</button>
      </form>
      {mensajeLogin && <p>{mensajeLogin}</p>}
    </div>
  );
}

export default LoginUsuario;
