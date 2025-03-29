import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './Register.css'

function Register() {
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [rol, setRol] = useState('usuario')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/auth/register', { nombre, correo, contraseña, rol })
      navigate('/')
    } catch (err) {
      setError('Error al registrarse. Intenta con otro correo.')
    }
  }

  return (
    <div className="register-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card register-card shadow-lg p-4 animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <i className="bi bi-person-plus fs-1 text-success"></i>
            <h2 className="fw-bold mt-2">Crear cuenta</h2>
            <p className="text-muted">Completa tus datos para registrarte</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nombre</label>
              <input type="text" className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Correo</label>
              <input type="email" className="form-control" value={correo} onChange={(e) => setCorreo(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Contraseña</label>
              <input type="password" className="form-control" value={contraseña} onChange={(e) => setContraseña(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label>Rol</label>
              <select className="form-control" value={rol} onChange={(e) => setRol(e.target.value)}>
                <option value="usuario">Usuario</option>
                <option value="admin">Administrador</option>
              </select>
            </div>
            <button type="submit" className="btn btn-success w-100">
              Registrarse
            </button>
            {error && <div className="text-danger text-center mt-3">{error}</div>}
            <p className="text-center mt-4 small">
              ¿Ya tienes cuenta? <a href="/">Inicia sesión</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Register
