import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products');
      setProducts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error al obtener productos:', err);
      setError('No se pudieron cargar los productos. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${productId}`);
        setProducts(products.filter(product => product._id !== productId));
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('No se pudo eliminar el producto');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando productos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={fetchProducts}>
          Intentar de nuevo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Productos Disponibles</h2>
        {user && user.role === 'admin' && (
          <Link to="/add-product">
            <Button variant="success">Añadir Producto</Button>
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <Alert variant="info">
          No hay productos disponibles en este momento.
          {user && user.role === 'admin' && (
            <div className="mt-2">
              <Link to="/add-product">Añadir el primer producto</Link>
            </div>
          )}
        </Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {products.map(product => (
            <Col key={product._id}>
              <Card className="h-100 product-card">
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    ${product.price.toFixed(2)}
                  </Card.Subtitle>
                  {product.description && (
                    <Card.Text>{product.description}</Card.Text>
                  )}
                </Card.Body>
                <Card.Footer className="bg-white">
                  <div className="d-grid gap-2">
                    <Link to={`/products/${product._id}`}>
                      <Button variant="primary" className="w-100">Ver Detalles</Button>
                    </Link>
                    
                    {user && (
                      user.role === 'admin' || 
                      (product.createdBy && product.createdBy._id === user.id) ? (
                        <div className="d-flex gap-2 mt-2">
                          <Link to={`/products/edit/${product._id}`} className="flex-grow-1">
                            <Button variant="warning" className="w-100">Editar</Button>
                          </Link>
                          <Button 
                            variant="danger" 
                            className="flex-grow-1"
                            onClick={() => handleDeleteProduct(product._id)}
                          >
                            Eliminar
                          </Button>
                        </div>
                      ) : (
                        <Link to={user ? "/purchase" : "/login"} className="mt-2">
                          <Button variant="success" className="w-100">
                            {user ? "Comprar" : "Inicia sesión para comprar"}
                          </Button>
                        </Link>
                      )
                    )}
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default ProductList;