import React, { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [ventas, setVentas] = useState([]);

  // Función para obtener las ventas
  const fetchVentas = async () => {
    const response = await fetch('http://localhost:5000/ventas');
    const data = await response.json();
    setVentas(data);
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/ventas', {
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
      <h2>Crear Pedido</h2>
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

      <h3>Lista de Ventas</h3>
      <ul>
        {ventas.map((venta, index) => (
          <li key={index}>{venta.nombre} compró {venta.producto}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
