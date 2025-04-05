import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/registro.css";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

const Registro = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [rol, setRol] = useState("usuario"); // Default usuario
  const navigate = useNavigate();

  const handleRegistro = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/register", { nombre, correo, password, rol });
      alert("Registro exitoso");
      navigate("/");
    } catch (error) {
      alert("Error en el registro");
    }
  };

  return (
    <div className="registro-container">
    <h2>Crear cuenta</h2>

    <div className="input-group">
      <FaUser className="icon" />
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
      />
    </div>

    <div className="input-group">
      <MdEmail className="icon" />
      <input
        type="email"
        placeholder="Correo electrónico"
        value={correo}
        onChange={(e) => setCorreo(e.target.value)}
      />
    </div>

    <div className="input-group">
      <FaLock className="icon" />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>

    <div className="input-group">
      <select value={rol} onChange={(e) => setRol(e.target.value)}>
        <option value="usuario">Usuario</option>
        <option value="admin">Administrador</option>
      </select>
    </div>

    <button onClick={handleRegistro}>Registrarse</button>

    <p>
      ¿Ya tienes cuenta?{" "}
      <span className="login-link" onClick={() => navigate("/")}>
        Inicia sesión
      </span>
    </p>
  </div>
);
};

export default Registro;
