import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const FormPago = ({ producto, onSubmit, onCancel }) => {
  const [datosPago, setDatosPago] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    numeroTarjeta: '',
    fechaVencimiento: '',
    ccv: ''
  });

  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...datosPago,
      producto: producto.nombre,
      valor: producto.valor
    });
  };
  


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Producto</Form.Label>
        <Form.Control
          type="text"
          value={producto.nombre}
          disabled
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Valor</Form.Label>
        <Form.Control
          type="number"
          value={producto.valor}
          disabled
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Nombre Completo</Form.Label>
        <Form.Control
          type="text"
          value={datosPago.nombre}
          onChange={(e) => setDatosPago({...datosPago, nombre: e.target.value})}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Cédula</Form.Label>
        <Form.Control
          type="text"
          value={datosPago.cedula}
          onChange={(e) => setDatosPago({...datosPago, cedula: e.target.value})}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Teléfono</Form.Label>
        <Form.Control
          type="tel"
          value={datosPago.telefono}
          onChange={(e) => setDatosPago({...datosPago, telefono: e.target.value})}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Número de Tarjeta</Form.Label>
        <Form.Control
          type="text"
          value={datosPago.numeroTarjeta}
          onChange={(e) => setDatosPago({...datosPago, numeroTarjeta: e.target.value})}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Fecha de Vencimiento</Form.Label>
        <Form.Control
          type="text"
          placeholder="MM/AA"
          value={datosPago.fechaVencimiento}
          onChange={(e) => setDatosPago({...datosPago, fechaVencimiento: e.target.value})}
          required
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>CCV</Form.Label>
        <Form.Control
          type="text"
          value={datosPago.ccv}
          onChange={(e) => setDatosPago({...datosPago, ccv: e.target.value})}
          required
        />
      </Form.Group>
      <div className="d-flex justify-content-between">
        <Button variant="danger" onClick={onCancel}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit">
          Confirmar Pago
        </Button>
      </div>
    </Form>
  );
};

export default FormPago; 