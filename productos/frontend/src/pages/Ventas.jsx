import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Ventas() {
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [ventas, setVentas] = useState([]);
  const [error, setError] = useState(null);

  // Función para obtener las ventas
  const fetchVentas = async () => {
    try {
      const response = await fetch('http://localhost:5002/ventas');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      const data = await response.json();
      setVentas(data); 
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5002/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, producto })
    });
    if (response.ok) {
      fetchVentas(); // Actualizar la lista
      setNombre('');
      setProducto('');
    }
  };

  return (
    <div>
      <nav className="navigation">
        <Link to="/usuarios">Usuarios</Link>
      </nav>
      
      <h2>Gestión de Ventas</h2>
      <div className="ventas-container">
        <div className="ventas-form">
          <h3>Crear Pedido</h3>
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
              placeholder="Producto" 
              value={producto} 
              onChange={(e) => setProducto(e.target.value)} 
              required 
            />
            <button type="submit">Enviar</button>
          </form>
        </div>
        
        <div className="ventas-list">
          <h3>Lista de Ventas</h3>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <ul>
            {ventas.map((venta, index) => (
              <li key={index}>{venta.nombre} compró {venta.producto}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Ventas;