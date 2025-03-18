import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [ventas, setVentas] = useState([]);
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/ventas');
      setVentas(response.data);
    } catch (error) {
      console.error('Error al cargar las ventas:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/ventas', {
        nombre,
        producto
      });
      setNombre('');
      setProducto('');
      cargarVentas();
    } catch (error) {
      console.error('Error al crear la venta:', error);
    }
  };

  return (
    <div className="App">
      <h1>Sistema de Ventas</h1>
      
      <div className="formulario">
        <h2>Nueva Venta</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Producto:</label>
            <input
              type="text"
              value={producto}
              onChange={(e) => setProducto(e.target.value)}
              required
            />
          </div>
          <button type="submit">Enviar</button>
        </form>
      </div>

      <div className="lista-ventas">
        <h2>Lista de Ventas</h2>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Producto</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta._id}>
                <td>{venta.nombre}</td>
                <td>{venta.producto}</td>
                <td>{new Date(venta.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;
