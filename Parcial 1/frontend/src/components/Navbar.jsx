import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import './Navbar.css'

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [rol, setRol] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  // Detecta cambios en la URL (login/logout) para actualizar el estado
  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRol = localStorage.getItem('rol')
    setIsLoggedIn(!!token)
    setRol(userRol)
  }, [location]) // <-- esto actualiza cuando cambia la ruta

  const logout = () => {
    localStorage.clear()
    navigate('/')
  }

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
      <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
  <img
    src="https://d2yoo3qu6vrk5d.cloudfront.net/images/20200811100824/captura-de-pantalla-2020-08-11-a-las-10-04-51-a-m.png"  // ← Logo D1 funcional y rápido (PNG)
    alt="D1 Logo"
    width="40"
    height="40"
    className="rounded-circle"
  />
  <span className="fw-bold">TIENDAS D1</span>
</Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#mainNavbar"
          aria-controls="mainNavbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="mainNavbar">
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto align-items-lg-center">
              {rol === 'usuario' && (
                <>
                  <li className="nav-item">
                    <Link className="nav-link" to="/marketplace">Marketplace</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link" to="/historial">Historial</Link>
                  </li>
                </>
              )}
              {rol === 'admin' && (
                <li className="nav-item">
                  <Link className="nav-link" to="/admin">Dashboard</Link>
                </li>
              )}
              <li className="nav-item mt-2 mt-lg-0">
                <button className="btn btn-outline-light ms-lg-3" onClick={logout}>
                  Cerrar sesión
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
