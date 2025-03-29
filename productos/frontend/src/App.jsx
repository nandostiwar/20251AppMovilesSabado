import React, { useState } from 'react';
import RegistroUsuario from './RegistroUsuario';
import LoginUsuario from './LoginUsuario';
import Mensajeria from './Mensajeria';

function App() {
  const [usuarioLogueado, setUsuarioLogueado] = useState(
    JSON.parse(localStorage.getItem('usuario')) || null
  );

  // Función para actualizar el estado cuando un usuario inicia sesión
  const handleLoginSuccess = (usuario) => {
    setUsuarioLogueado(usuario);
    localStorage.setItem('usuario', JSON.stringify(usuario));
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    setUsuarioLogueado(null);
    localStorage.removeItem('usuario');
  };

  return (
    <div>
      {!usuarioLogueado ? (
        <>
          <RegistroUsuario />
          <LoginUsuario onLoginSuccess={handleLoginSuccess} />
        </>
      ) : (
        <Mensajeria usuario={usuarioLogueado} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;
