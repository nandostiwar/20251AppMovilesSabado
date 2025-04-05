import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaUser, FaLock } from "react-icons/fa";
import "../styles/login.css"; // Asegúrate de tener este archivo

const Login = () => {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
        const response = await axios.post("http://localhost:5000/api/auth/login", { correo, password });

        console.log("Respuesta del backend:", response.data);

        if (response.data.token && response.data.rol) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("rol", response.data.rol); // ✅ Guardar el rol en localStorage

            // 🔥 Redirigir según el rol
            if (response.data.rol === "admin") {
                navigate("/admin");
            } else {
                navigate("/compras");
            }
        } else {
            alert("No se recibió token o rol en la respuesta");
        }
    } catch (error) {
        console.error("Error en el login", error.response?.data || error.message);
        alert("Error en el login");
    }
};


  return (
    <div className="login-container">
    <h2>Iniciar sesión</h2>
    <div className="input-group">
      <FaUser className="icon" />
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
    <button onClick={handleLogin}>Ingresar</button>
    <p>
      ¿No tienes cuenta?{" "}
      <span className="register-link" onClick={() => navigate("/registro")}>
        Regístrate aquí
      </span>
    </p>
  </div>
);
};

export default Login;
