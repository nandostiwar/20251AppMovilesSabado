import { useState } from 'react';
import { authService } from '../api';

const Registro = ({ onRegister, tipoRegistro }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const { data } = await authService.registro({
        ...formData,
        rol: tipoRegistro
      });
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', data.usuario.rol);
      onRegister(data.usuario);
    } catch (error) {
      setError('Error al registrar usuario');
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>{tipoRegistro === 'admin' ? 'Registro Administrador' : 'Registro Usuario'}</h2>
        
        {error && <div className="error">{error}</div>}
        
        <div className="form-group-registro">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre completo"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-registro">
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-registro">
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="form-group-registro">
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">
          {tipoRegistro === 'admin' ? 'Registrar como Administrador' : 'Registrar como Usuario'}
        </button>
      </form>
    </div>
  );
};

export default Registro;