import React, { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [domicilio, setDomicilio] = useState('');
  const [correo, setCorreo] = useState('');
  const [ventas, setVentas] = useState([]);
  const [usuario, setUsuario] = useState([]);

  // Función para obtener las ventas
  const fetchVentas = async () => {
    const response = await fetch('http://localhost:5000/ventas');
    const data = await response.json();
    setVentas(data);
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  // Función para obtener los usuarios
  const fetchUsuario = async () => {
    const response = await fetch('http://localhost:5000/usuario');
    const data = await response.json();
    setUsuario(data);
  };

  useEffect(() => {
    fetchUsuario();
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Enviar datos a la colección ventas
      await fetch('http://localhost:5000/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, producto, domicilio, correo })
      });

      // Enviar datos a la colección usuario
      await fetch('http://localhost:5000/usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, domicilio, telefono, correo })
      });

      fetchVentas(); // Actualizar lista de ventas
      fetchUsuario(); // Actualizar lista de usuario

      setNombre('');
      setProducto('');
      setTelefono('');
      setDomicilio('');
      setCorreo('');
    } catch (error) {
      console.error('Error al guardar los datos:', error);
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
          placeholder="Domicilio" 
          value={domicilio} 
          onChange={(e) => setDomicilio(e.target.value)} 
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
          placeholder="Correo" 
          value={correo} 
          onChange={(e) => setCorreo(e.target.value)} 
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

      <h3>Lista de Clientes</h3>
      <table>
  <thead>
    <tr>
      <th>Nombre  </th>
      <th>  Teléfono  </th>
      <th>  Domicilio  </th>
      <th>  Correo  </th>
    </tr>
  </thead>
  <tbody>
    {usuario.map((usuario, index) => (
      <tr key={index}>
        <td>{usuario.nombre}</td>
        <td>{usuario.telefono}</td>
        <td>{usuario.domicilio}</td>
        <td>{usuario.correo}</td>
      </tr>
    ))}
  </tbody>
</table>
    </div>
  );
}

export default App;