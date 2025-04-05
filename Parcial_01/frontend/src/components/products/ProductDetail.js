import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error al cargar detalles del producto:', err);
        setError('No se pudo cargar la información del producto');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleDeleteProduct = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        await axios.delete(`/api/products/${id}`);
        navigate('/products');
      } catch (err) {
        console.error('Error al eliminar producto:', err);
        alert('Error al eliminar el producto');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando detalles del producto...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="my-5">
        <Alert variant="danger">
          {error || 'Producto no encontrado'}
        </Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Volver a la lista de productos
        </Button>
      </Container>
    );
  }

  const isOwnerOrAdmin = user && (
    user.role === 'admin' || 
    (product.createdBy && product.createdBy._id === user.id)
  );

  return (
    <Container className="my-5">
      <Row>
        <Col lg={8} className="mx-auto">
          <Card>
            <Card.Header>
              <h2 className="mb-0">{product.name}</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <p className="lead">
                    <strong>Precio: </strong>${product.price?.toFixed(2)}
                  </p>
                  
                  {product.description && (
                    <div className="mb-4">
                      <h5>Descripción:</h5>
                      <p>{product.description}</p>
                    </div>
                  )}
                  
                  {product.createdBy && (
                    <p className="text-muted">
                      <small>Vendedor: {product.createdBy.name}</small>
                    </p>
                  )}
                </Col>
                <Col md={4} className="text-end">
                  <div className="d-grid gap-2">
                    {user ? (
                      <Link to="/purchase" state={{ product }}>
                        <Button variant="success" className="w-100">
                          Comprar
                        </Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button variant="outline-success" className="w-100">
                          Inicia sesión para comprar
                        </Button>
                      </Link>
                    )}
                    
                    {isOwnerOrAdmin && (
                      <>
                        <Link to={`/products/edit/${product._id}`}>
                          <Button variant="warning" className="w-100 mt-2">
                            Editar
                          </Button>
                        </Link>
                        <Button 
                          variant="danger" 
                          className="w-100 mt-2"
                          onClick={handleDeleteProduct}
                        >
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/products')}
              >
                Volver a la lista de productos
              </Button>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductDetail;