import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' // Valor predeterminado: usuario regular
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const { name, email, password, confirmPassword, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validación
    if (!name || !email || !password) {
      return setError('Por favor completa todos los campos');
    }

    if (password !== confirmPassword) {
      return setError('Las contraseñas no coinciden');
    }

    if (password.length < 6) {
      return setError('La contraseña debe tener al menos 6 caracteres');
    }

    try {
      setLoading(true);
      
      const registerData = {
        name,
        email,
        password,
        role // Incluir el rol seleccionado
      };
      
      const response = await axios.post('/api/auth/register', registerData);
      
      // Guardar usuario y token
      login(response.data.user, response.data.token);
      
      navigate('/');
    } catch (err) {
      console.error('Error de registro:', err);
      setError(err.response?.data?.error || 'Error al registrar usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <Card>
        <Card.Body>
          <h2 className="text-center mb-4">Registro de Usuario</h2>
          
          {error && <Alert variant="danger">{error}</Alert>}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="correo@ejemplo.com"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Mínimo 6 caracteres"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="confirmPassword">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleChange}
                placeholder="Confirma tu contraseña"
                required
              />
            </Form.Group>
            
            <Form.Group className="mb-3" controlId="role">
              <Form.Label>Tipo de Cuenta</Form.Label>
              <Form.Select
                name="role"
                value={role}
                onChange={handleChange}
                aria-label="Selecciona el tipo de cuenta"
              >
                <option value="user">Usuario Regular</option>
                <option value="admin">Administrador</option>
              </Form.Select>
              <Form.Text className="text-muted">
                Los administradores pueden gestionar productos y ver todas las compras.
              </Form.Text>
            </Form.Group>
            
            <Button 
              variant="primary" 
              type="submit" 
              className="w-100 mt-3"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrarse'}
            </Button>
          </Form>
          
          <div className="text-center mt-3">
            ¿Ya tienes una cuenta? <Link to="/login">Inicia Sesión</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default Register;