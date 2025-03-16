import { useState, useEffect } from 'react';

function App() {
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [correo, setCorreo] = useState('');
  const [ventas, setVentas] = useState([]);
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetchVentas();
    fetchClientes();
  }, []);

  const fetchVentas = async () => {
    const response = await fetch('http://localhost:5000/ventas');
    const data = await response.json();
    setVentas(data);
  };

  const fetchClientes = async () => {
    const response = await fetch('http://localhost:5000/clientes');
    const data = await response.json();
    setClientes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('http://localhost:5000/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, producto, telefono, direccion, correo })
    });

    if (response.ok) {
      fetchVentas(); // Actualizar lista de ventas
      fetchClientes(); // Actualizar lista de clientes
      setNombre('');
      setProducto('');
      setTelefono('');
      setDireccion('');
      setCorreo('');
    }
  };

  return (
    <div>
      <h2>Crear Pedido</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <input type="text" placeholder="Producto" value={producto} onChange={(e) => setProducto(e.target.value)} required />
        <input type="text" placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        <input type="text" placeholder="Dirección" value={direccion} onChange={(e) => setDireccion(e.target.value)} required />
        <input type="email" placeholder="Correo" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
        <button type="submit">Enviar</button>
      </form>

      <h2>Lista de Ventas</h2>
      <ul>
        {ventas.map((venta, index) => (
          <li key={index}>
            {venta.nombre} - {venta.producto}
          </li>
        ))}
      </ul>

      <h2>Lista de Clientes</h2>
      <ul>
        {clientes.map((cliente, index) => (
          <li key={index}>
            {cliente.nombre} - {cliente.telefono} - {cliente.direccion} - {cliente.correo}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
