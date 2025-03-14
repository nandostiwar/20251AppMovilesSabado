import React, { useState, useEffect } from 'react';

function App() {
  // Estados para ventas
  const [nombre, setNombre] = useState('');
  const [producto, setProducto] = useState('');
  const [ventas, setVentas] = useState([]);

  // Estados para clientes
  const [clientes, setClientes] = useState([]);
  const [clienteNombre, setClienteNombre] = useState('');
  const [clienteEmail, setClienteEmail] = useState('');
  const [clienteTelefono, setClienteTelefono] = useState('');

  // Estados para productos
  const [productos, setProductos] = useState([]);
  const [productoNombre, setProductoNombre] = useState('');
  const [productoDescripcion, setProductoDescripcion] = useState('');
  const [productoPrecio, setProductoPrecio] = useState('');
  const [productoStock, setProductoStock] = useState('');

  // Función para obtener datos
  const fetchVentas = async () => {
    const response = await fetch('http://localhost:3000/ventas');
    const data = await response.json();
    setVentas(data);
  };

  const fetchClientes = async () => {
    const response = await fetch('http://localhost:3000/clientes');
    const data = await response.json();
    setClientes(data);
  };

  const fetchProductos = async () => {
    const response = await fetch('http://localhost:3000/productos');
    const data = await response.json();
    setProductos(data);
  };

  useEffect(() => {
    fetchVentas();
    fetchClientes();
    fetchProductos();
  }, []);

  // Manejar envíos de formularios
  const handleVentaSubmit = async (e) => {
    e.preventDefault();
    if (!producto) {
      alert('Seleccione un producto válido');
      return;
    }
    await fetch('http://localhost:3000/ventas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, producto })
    });
    fetchVentas();
  };

  const handleClienteSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: clienteNombre, email: clienteEmail, telefono: clienteTelefono })
    });
    fetchClientes();
  };

  const handleProductoSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: productoNombre, descripcion: productoDescripcion, precio: productoPrecio, stock: productoStock })
    });
    fetchProductos();
  };

  return (
    <div>
      <h1>Gestión de Ventas</h1>
      <form onSubmit={handleVentaSubmit}>
        <input type="text" placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        <select value={producto} onChange={(e) => setProducto(e.target.value)} required>
          <option value="">Seleccione un producto</option>
          {productos.map((prod) => (
            <option key={prod._id} value={prod._id}>{prod.nombre} - Stock: {prod.stock}</option>
          ))}
        </select>
        <button type="submit">Agregar Venta</button>
      </form>
      <ul>{ventas.map((venta, index) => <li key={index}>{venta.nombre} compró {venta.producto.nombre}</li>)}</ul>

      <h1>Gestión de Clientes</h1>
      <form onSubmit={handleClienteSubmit}>
        <input type="text" placeholder="Nombre" value={clienteNombre} onChange={(e) => setClienteNombre(e.target.value)} required />
        <input type="email" placeholder="Email" value={clienteEmail} onChange={(e) => setClienteEmail(e.target.value)} required />
        <input type="text" placeholder="Teléfono" value={clienteTelefono} onChange={(e) => setClienteTelefono(e.target.value)} required />
        <button type="submit">Agregar Cliente</button>
      </form>
      <ul>{clientes.map((cliente, index) => <li key={index}>{cliente.nombre} - {cliente.email} - {cliente.telefono}</li>)}</ul>

      <h1>Gestión de Productos</h1>
      <form onSubmit={handleProductoSubmit}>
        <input type="text" placeholder="Nombre" value={productoNombre} onChange={(e) => setProductoNombre(e.target.value)} required />
        <input type="text" placeholder="Descripción" value={productoDescripcion} onChange={(e) => setProductoDescripcion(e.target.value)} required />
        <input type="number" placeholder="Precio" value={productoPrecio} onChange={(e) => setProductoPrecio(e.target.value)} required />
        <input type="number" placeholder="Stock" value={productoStock} onChange={(e) => setProductoStock(e.target.value)} required />
        <button type="submit">Agregar Producto</button>
      </form>
      <ul>{productos.map((producto, index) => <li key={index}>{producto.nombre} - {producto.descripcion} - ${producto.precio} - Stock: {producto.stock}</li>)}</ul>
    </div>
  );
}

export default App;
