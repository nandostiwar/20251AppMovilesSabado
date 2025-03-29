import { useState } from 'react';
import { authService } from '../api';

const Login = ({ onLogin, onShowRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const { data } = await authService.login({ email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.usuario.rol);
      onLogin(data.usuario);
    } catch (error) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Iniciar Sesión</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit">Ingresar</button>

        <div className="registro-opciones">
          <p>¿No tienes una cuenta?</p>
          <button 
            type="button" 
            className="btn-registro"
            onClick={() => onShowRegister('usuario')}
          >
            Registrarse como Usuario
          </button>
          <button 
            type="button" 
            className="btn-registro"
            onClick={() => onShowRegister('admin')}
          >
            Registrarse como Administrador
          </button>
        </div>
      </form>
    </div>
  );
};

export default Login;