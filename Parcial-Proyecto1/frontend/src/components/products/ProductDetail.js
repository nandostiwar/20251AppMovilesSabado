import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Card, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/products/${id}`);
        setProduct(response.data);
      } catch (err) {
        console.error('Error al cargar el producto:', err);
        setError('No se pudo cargar la información del producto.');
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
        setError('No se pudo eliminar el producto.');
      }
    }
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Cargando detalles del producto...</p>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="danger">{error || 'Producto no encontrado'}</Alert>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Volver a la lista
        </Button>
      </Container>
    );
  }

  const isOwnerOrAdmin = user && (user.role === 'admin' || product.createdBy?._id === user.id);

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col lg={8}>
          <Card className="shadow-lg">
            <Card.Header as="h2" className="bg-success text-white text-center">
              {product.name}
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={8}>
                  <p className="lead"><strong>Precio:</strong> ${product.price?.toFixed(2)}</p>
                  {product.description && (
                    <div className="mb-4">
                      <h5>Descripción:</h5>
                      <p>{product.description}</p>
                    </div>
                  )}
                  {product.createdBy && (
                    <p className="text-muted"><small>Vendedor: {product.createdBy.name}</small></p>
                  )}
                </Col>
                <Col md={4} className="text-end">
                  <div className="d-grid gap-2">
                    {user ? (
                      <Link to="/purchase" state={{ product }}>
                        <Button variant="success" className="w-100">Comprar</Button>
                      </Link>
                    ) : (
                      <Link to="/login">
                        <Button variant="outline-success" className="w-100">Inicia sesión para comprar</Button>
                      </Link>
                    )}
                    {isOwnerOrAdmin && (
                      <>
                        <Link to={`/products/edit/${product._id}`}>
                          <Button variant="warning" className="w-100 mt-2">Editar</Button>
                        </Link>
                        <Button variant="danger" className="w-100 mt-2" onClick={handleDeleteProduct}>
                          Eliminar
                        </Button>
                      </>
                    )}
                  </div>
                </Col>
              </Row>
            </Card.Body>
            <Card.Footer className="text-center">
              <Button variant="secondary" onClick={() => navigate('/products')}>
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
