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

    if (!name.trim() || !price) {
      return setError('Por favor, ingresa el nombre y el precio del producto.');
    }

    if (isNaN(price) || parseFloat(price) <= 0) {
      return setError('El precio debe ser un número válido mayor a 0.');
    }

    try {
      setLoading(true);
      
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
      console.error('Error al agregar el producto:', err);
      setError(
        err.response?.data?.error || 
        'No se pudo registrar el producto. Intenta de nuevo más tarde.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
      <Card className="shadow-lg">
        <Card.Header as="h2" className="text-center bg-success text-white">
          Nuevo Producto
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            {error && <Alert variant="danger">{error}</Alert>}
            
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre*</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Ejemplo: Café Premium 500g"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="price">
              <Form.Label>Precio (USD)*</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={price}
                onChange={handleChange}
                placeholder="Ejemplo: 15.99"
                min="0.01"
                step="0.01"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={description}
                onChange={handleChange}
                placeholder="Añade detalles sobre el producto (opcional)"
                rows={4}
              />
            </Form.Group>
            
            <div className="d-grid gap-2">
              <Button 
                variant="primary" 
                type="submit"
                disabled={loading}
              >
                {loading ? 'Guardando...' : 'Registrar Producto'}
              </Button>
              <Button 
                variant="outline-secondary" 
                onClick={() => navigate('/products')}
              >
                Volver a la Lista
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddProduct;
