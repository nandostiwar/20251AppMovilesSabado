import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import { Table, Button, Form, Modal } from 'react-bootstrap';
import axios from 'axios';
import FormPago from './FormPago';

const Compras = () => {
  const [productos, setProductos] = useState([]);
  const [historial, setHistorial] = useState([]);
  const [showPago, setShowPago] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre: '',
    valor: ''
  });

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const response = await axios.get('http://localhost:4000/v1/restaurante/ventas/listar');
      setHistorial(response.data);
    } catch (error) {
      console.error('Error al cargar historial:', error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowPago(true);
  };

  const home = useNavigate();
  function goHome() {
    home("/");
}

const handlePago = async (datosPago) => {
  try {
    const usuario = JSON.parse(localStorage.getItem('user'));

    await axios.post('http://localhost:4000/v1/restaurante/ventas/crear-venta', {
      ...productoActual,
      ...datosPago,
      usuario: usuario
    });

    setShowPago(false);
    cargarHistorial(); // ✅ esto ya está bien aquí

  } catch (error) {
    console.error('Error al procesar pago:', error);

    if (error.response?.data?.mensaje) {
      alert(error.response.data.mensaje);
    } else {
      alert('Error al procesar el pago. Por favor, intente nuevamente.');
    }

    cargarHistorial(); // ✅ importante también aquí, en el catch
  }
};

  return (
    <div className="container mt-2">
      <h1 className="text-start">Vista Usuario</h1>
      <h2 className="mt-5">Realizar Compra</h2>
      <Form onSubmit={handleSubmit} className="mb-4">
        <div className="d-flex flex-column align-items-center">
          <Form.Group className="mb-3 w-50">
            <Form.Label>Nombre del Producto</Form.Label>
            <Form.Control
              type="text"
              value={productoActual.nombre}
              onChange={(e) => setProductoActual({...productoActual, nombre: e.target.value})}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3 w-50">
            <Form.Label>Valor</Form.Label>
            <Form.Control
              type="number"
              value={productoActual.valor}
              onChange={(e) => setProductoActual({...productoActual, valor: e.target.value})}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Pagar
          </Button>
        </div>
      </Form>

      <h2>Historial de Compras</h2>
      <div className="d-flex justify-content-end mb-4 mt-5">
        <Button variant="info" onClick={() => cargarHistorial()}>
          Actualizar
        </Button>
      </div>
      <div className="table-container">
  <table className="table table-hover align-middle shadow-sm rounded bg-white">
    <thead className="table-light">
      <tr>
        <th>Fecha</th>
        <th>Producto</th>
        <th>Valor</th>
        <th>Estado</th>
      </tr>
    </thead>
    <tbody>
      {historial.map((compra) => (
        <tr key={compra._id}>
          <td>{new Date(compra.fecha).toLocaleDateString('es-ES')}</td>
          <td>{compra.producto}</td>
          <td>${compra.valor}</td>
          <td>
            <span className={`badge px-3 py-2 rounded-pill fw-semibold ${
              compra.estado === 'Aprobado'
                ? 'bg-success text-white'
                : 'bg-danger text-white'
            }`}>
              {compra.estado}
            </span>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      <Modal show={showPago} onHide={() => setShowPago(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Proceso de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="alert alert-info">
            <strong>Datos para la tarjeta:</strong><br/>
            Número: 9858658998562541<br/>
            Fecha: 12/29<br/>
            CCV: 596
          </div>
          <FormPago 
            producto={productoActual}
            onSubmit={handlePago}
            onCancel={() => setShowPago(false)}
          />
        </Modal.Body>
      </Modal>

      <div className="d-flex justify-content-center mt-4">
        <button className="home-btn" onClick={goHome}>
          Home
        </button>
      </div>
      
    </div>
  );
}

export default Compras; 