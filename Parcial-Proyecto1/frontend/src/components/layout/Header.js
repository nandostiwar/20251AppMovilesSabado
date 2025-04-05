import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">ShopNow</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            
            {user && (
              <>
                <Nav.Link as={Link} to="/shop">Tienda</Nav.Link>
                <Nav.Link as={Link} to="/orders">Mis Pedidos</Nav.Link>
              </>
            )}
            
            {user?.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/admin/products">Gestión de Productos</Nav.Link>
                <Nav.Link as={Link} to="/admin/orders">Órdenes de Compra</Nav.Link>
              </>
            )}
          </Nav>
          
          <Nav>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <span className="text-white me-3">
                  ¡Bienvenido, {user.name}! ({user.role === 'admin' ? 'Administrador' : 'Cliente'})
                </span>
                <Button variant="outline-light" size="sm" onClick={handleLogout}>
                  Cerrar Sesión
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
