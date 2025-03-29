import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Marketplace from "./components/Marketplace";
import Administrador from "./components/Administrador";
import "./index.css";

function App() {
  const [usuario, setUsuario] = useState(null);
  const [mostrarRegistro, setMostrarRegistro] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState(null);
  const [scrollOpacity, setScrollOpacity] = useState(1); // Opacidad inicial

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");
    const userRole = localStorage.getItem("userRole");
    if (usuarioGuardado) {
      const userData = JSON.parse(usuarioGuardado);
      userData.rol = userRole || userData.rol;
      setUsuario(userData);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY; // Obtiene la cantidad de scroll
      const newOpacity = Math.max(0.4, 1 - scrollTop / 500); // Reduce progresivamente hasta 0.4
      setScrollOpacity(newOpacity);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogin = (usuarioData) => {
    setUsuario(usuarioData);
    localStorage.setItem("usuario", JSON.stringify(usuarioData));
  };

  const handleLogout = () => {
    setUsuario(null);
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
  };

  const handleShowRegister = (tipo) => {
    setTipoRegistro(tipo);
    setMostrarRegistro(true);
  };

  const volverALogin = () => {
    setMostrarRegistro(false);
    setTipoRegistro(null);
  };

  if (!usuario) {
    return (
      <div className="container">
        {mostrarRegistro ? (
          <div className="auth-container">
            <Registro onRegister={handleLogin} tipoRegistro={tipoRegistro} />
            <div className="toggle-auth">
              <p>¿Ya tienes una cuenta?</p>
              <button onClick={volverALogin}>Iniciar Sesión</button>
            </div>
          </div>
        ) : (
          <div className="auth-container">
            <Login onLogin={handleLogin} onShowRegister={handleShowRegister} />
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <nav
        className="navbar"
        style={{
          backgroundColor: `rgba(26, 26, 26, ${scrollOpacity})`, // Control dinámico de transparencia
          backdropFilter: `blur(${(1 - scrollOpacity) * 10}px)`, // Más desenfoque a medida que avanza el scroll
        }}
      >
        <div className="navbar-content">
          <h1 className="navbar-title">Marketplace Esteban Muñoz</h1>
          <div className="user-info">
            <span>
              Bienvenido, {usuario.nombre} ({usuario.rol})
            </span>
            <button onClick={handleLogout}>Cerrar Sesión</button>
          </div>
        </div>
      </nav>

      <div className="container">
        {usuario.rol === "admin" ? <Administrador /> : <Marketplace usuario={usuario} />}
      </div>
      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 Esteban Muñoz. Todos los derechos reservados.</p>
          <div className="social-links">
            <a href="https://www.linkedin.com/in/esteban-mu%C3%B1oz-rios-183677351/" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin"></i>
            </a>
            <a href="https://instagram.com/oldcoeur" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://x.com/oldcoeur" target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter"></i>
            </a>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
