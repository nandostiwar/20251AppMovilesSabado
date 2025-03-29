import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api, { setAuthToken } from '../api'
import './Login.css'

function Login() {
  const [correo, setCorreo] = useState('')
  const [contraseña, setContraseña] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      const res = await api.post('/auth/login', { correo, contraseña })
      const { token, rol, userId } = res.data

      localStorage.setItem('token', token)
      localStorage.setItem('rol', rol)
      localStorage.setItem('userId', userId)
      setAuthToken(token)

      navigate(rol === 'admin' ? '/admin' : '/marketplace')
    } catch (err) {
      setError('Correo o contraseña incorrectos.')
    }
  }

  return (
    <div className="login-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card login-card shadow-lg p-4 animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <i className="bi bi-person-circle fs-1 text-primary"></i>
            <h2 className="fw-bold mt-2">Bienvenido</h2>
            <p className="text-muted">Ingresa para continuar</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label>Correo</label>
              <input
                type="email"
                className="form-control"
                placeholder="correo@ejemplo.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-4">
              <label>Contraseña</label>
              <input
                type="password"
                className="form-control"
                placeholder="********"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Ingresar
            </button>
            {error && <div className="text-danger text-center mt-3">{error}</div>}
            <p className="text-center mt-4 small">
              ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login
