import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Usuarios() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [usuarios, setUsuarios] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener los usuarios
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('http://localhost:5002/usuarios');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5002/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, telefono, direccion, correo })
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      fetchUsuarios(); // Actualizar la lista
      // Limpiar el formulario
      setNombre('');
      setTelefono('');
      setDireccion('');
      setCorreo('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div>
      <nav className="navigation">
        <Link to="/ventas">Ventas</Link>
      </nav>
      
      <h2>Gestión de Usuarios</h2>
      <div className="usuarios-container">
        <div className="usuarios-form">
          <h3>Registrar Usuario</h3>
          <form onSubmit={handleSubmit}>
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
              value={telefono} 
              onChange={(e) => setTelefono(e.target.value)} 
              required 
            />
            <input 
              type="text" 
              placeholder="Dirección" 
              value={direccion} 
              onChange={(e) => setDireccion(e.target.value)} 
              required 
            />
            <input 
              type="email" 
              placeholder="Correo electrónico" 
              value={correo} 
              onChange={(e) => setCorreo(e.target.value)} 
              required 
            />
            <button type="submit">Guardar</button>
          </form>
        </div>
        
        <div className="usuarios-list">
          <h3>Lista de Usuarios</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {usuarios.map((usuario, index) => (
              <li key={index}>
                <strong>{usuario.nombre}</strong><br />

              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Usuarios;