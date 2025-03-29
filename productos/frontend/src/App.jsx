import React, { useState, useEffect } from 'react';

function App() {
  const backgroundImageUrl = "https://d1eipm3vz40hy0.cloudfront.net/images/SSAC-Blog/mercadotecnia-marketing-productos.jpg";

  const [nombreCliente, setNombreCliente] = useState('');
  const [direccion, setDireccion] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [ventas, setVentas] = useState([]);

  const fetchVentas = async () => {
    try {
      const response = await fetch('https://rk0k46fr-5000.use.devtunnels.ms/venta');
      const data = await response.json();
      setVentas(data);
    } catch (error) {
      console.error('Error al obtener ventas:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const clienteData = { nombre: nombreCliente, direccion, telefono, correo };
    const ventaData = { nombre, producto };

    try {
      await fetch('https://rk0k46fr-5000.use.devtunnels.ms/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteData),
      });

      await fetch('https://rk0k46fr-5000.use.devtunnels.ms/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ventaData),
      });

      fetchVentas();
      setNombreCliente('');
      setDireccion('');
      setTelefono('');
      setCorreo('');
      setNombre('');
      setProducto('');
      alert('Datos registrados correctamente');
    } catch (error) {
      console.error('Error en la solicitud:', error);
    }
  };

  return (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        flexDirection: 'column',
        height: '100vh', 
        width: '100vw', 
        margin: '0', 
        padding: '0', 
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div 
        style={{ 
          width: '400px', 
          padding: '20px', 
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          borderRadius: '10px', 
          textAlign: 'center' 
        }}
      >
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Nombre Cliente" value={nombreCliente} onChange={(e) => setNombreCliente(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="text" placeholder="Nombre Producto" value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <input type="text" placeholder="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} style={{ width: '100%', marginBottom: '10px' }} />
          <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Enviar</button>
        </form>

        <h3 style={{ marginTop: '30px' }}>Lista de Ventas</h3>
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {ventas.map((venta, index) => (
            <li key={index} style={{ padding: '5px', borderBottom: '1px solid #ccc' }}>{venta.nombre} compró {venta.producto}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
