import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const AddProduct = () => {
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { name, price, description } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones básicas
    if (!name.trim() || !price) {
      return setError('El nombre y el precio son obligatorios');
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return setError('El precio debe ser un número mayor que 0');
    }

    try {
      setLoading(true);
      
      // Configurar el encabezado de autorización
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const productData = {
        name: name.trim(),
        price: parseFloat(price),
        description: description.trim() || undefined
      };
      
      await axios.post('/api/products', productData, config);
      
      navigate('/products');
    } catch (err) {
      console.error('Error al crear el producto:', err);
      setError(
        err.response?.data?.error || 
        'Error al crear el producto. Verifica tu conexión e inténtalo nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-sm">
        <Card.Header as="h2" className="text-center bg-primary text-white">
          Añadir Nuevo Producto
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre del Producto*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Ingresa el nombre del producto"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Precio*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="Ingresa el precio"
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción (opcional)</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="Ingresa una descripción para el producto"
                rows={5}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="success" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Guardar Producto'}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/products')}
              >
                Cancelar
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;