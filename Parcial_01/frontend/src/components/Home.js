import React, { useContext } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <div className="text-center mb-4">
            <h1>Bienvenido al Marketplace</h1>
            <p className="lead">
              La plataforma donde puedes comprar y vender productos de manera fácil y segura.
            </p>
          </div>
        </Col>
      </Row>

      <Row className="mb-4">
        {/* <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Explorar Productos</Card.Title>
              <Card.Text>
                Descubre una amplia variedad de productos disponibles en nuestro marketplace.
              </Card.Text>
              <Link to="/products">
                <Button variant="primary">Ver Productos</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col> */}

        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Realizar una Compra</Card.Title>
              <Card.Text>
                Realiza compras de manera rápida y segura en nuestra plataforma.
              </Card.Text>
              {user ? (
                <Link to="/purchase">
                  <Button variant="success">Comprar Ahora</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline-success">Inicia sesión para comprar</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4} className="mb-3">
          <Card className="h-100">
            <Card.Body>
              <Card.Title>Historial de Compras</Card.Title>
              <Card.Text>
                Visualiza y administra tus compras anteriores.
              </Card.Text>
              {user ? (
                <Link to="/my-purchases">
                  <Button variant="info">Ver Mis Compras</Button>
                </Link>
              ) : (
                <Link to="/login">
                  <Button variant="outline-info">Inicia sesión para ver</Button>
                </Link>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {user && user.role === 'admin' && (
        <Row className="mb-4">
          <Col>
            <Card className="admin-controls">
              <Card.Body>
                <Card.Title>Panel de Administración</Card.Title>
                <Card.Text>
                  Accede a las opciones de administración de la plataforma.
                </Card.Text>
                <Row>
                  
                  <Col md={6} className="mb-2">
                    <Link to="/admin/purchases" className="d-grid">
                      <Button variant="warning">Ver Todas las Compras</Button>
                    </Link>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default Home;