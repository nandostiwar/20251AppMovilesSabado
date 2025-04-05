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
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">Marketplace</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Inicio</Nav.Link>
            {/* <Nav.Link as={Link} to="/products">Productos</Nav.Link> */}
            
            {/* {user && (
              <>
                <Nav.Link as={Link} to="/purchase">Realizar Compra</Nav.Link>
                <Nav.Link as={Link} to="/my-purchases">Mis Compras</Nav.Link>
              </>
            )} */}
            
            {/* {user && user.role === 'admin' && (
              <>
                <Nav.Link as={Link} to="/add-product">Añadir Producto</Nav.Link>
                <Nav.Link as={Link} to="/admin/purchases">Todas las Compras</Nav.Link>
              </>
            )} */}
          </Nav>
          
          <Nav>
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">Iniciar Sesión</Nav.Link>
                <Nav.Link as={Link} to="/register">Registrarse</Nav.Link>
              </>
            ) : (
              <div className="d-flex align-items-center">
                <span className="text-light me-3">
                  Hola, {user.name} ({user.role === 'admin' ? 'Admin' : 'Usuario'})
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