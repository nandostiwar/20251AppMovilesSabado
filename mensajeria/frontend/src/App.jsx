import { useState } from "react";
import axios from "axios";

function App() {
  // Estados para el registro
  const [registerData, setRegisterData] = useState({ nombre: "", telefono: "", password: "" });

  // Estados para el login
  const [loginData, setLoginData] = useState({ nombre: "", telefono: "" });

  // Estado para usuario autenticado y mensajes
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Función para registrar un usuario
  const register = async () => {
    try {
      await axios.post("http://localhost:5000/register", registerData);
      alert("Usuario registrado");
      setRegisterData({ nombre: "", telefono: "", password: "" });
    } catch (err) {
      console.error(err);
      alert("Error en el registro");
    }
  };

  // Función para iniciar sesión
  const login = async () => {
    try {
      const { data } = await axios.post("http://localhost:5000/login", loginData);
      setLoggedInUser(data.user);
      fetchMessages(data.user.nombre);
    } catch (err) {
      console.error(err);
      alert("Error en el login");
    }
  };

  // Función para enviar un mensaje
  const sendMessage = async () => {
    if (!receiver || !message) return alert("Ingresa destinatario y mensaje");

    try {
      await axios.post("http://localhost:5000/send", {
        sender: loggedInUser.nombre,
        receiver,
        message,
      });

      alert("Mensaje enviado");
      setMessage("");
      setReceiver("");
      fetchMessages(loggedInUser.nombre);
    } catch (err) {
      console.error(err);
      alert("Error al enviar el mensaje");
    }
  };

  // Función para traer los mensajes del usuario autenticado
  const fetchMessages = async (user) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/messages/${user}`);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "200px", maxWidth: "6000px", margin: "auto" }}>
      {!loggedInUser ? (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {/* Registro */}
          <div style={{ width: "45%", borderRight: "2px solid gray", paddingRight: "10px" }}>
            <h2>Registro</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={registerData.nombre}
              onChange={(e) => setRegisterData({ ...registerData, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={registerData.telefono}
              onChange={(e) => setRegisterData({ ...registerData, telefono: e.target.value })}
            />
            <input
              type="password"
              placeholder="Contraseña"
              value={registerData.password}
              onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
            />
            <button onClick={register}>Registrarse</button>
          </div>

          {/* Login */}
          <div style={{ width: "45%", paddingLeft: "10px" }}>
            <h2>Login</h2>
            <input
              type="text"
              placeholder="Nombre"
              value={loginData.nombre}
              onChange={(e) => setLoginData({ ...loginData, nombre: e.target.value })}
            />
            <input
              type="text"
              placeholder="Teléfono"
              value={loginData.telefono}
              onChange={(e) => setLoginData({ ...loginData, telefono: e.target.value })}
            />
            <button onClick={login}>Iniciar Sesión</button>
          </div>
        </div>
      ) : (
        <div>
          <h2>Enviar Mensaje</h2>
          <input
            type="text"
            placeholder="Número destinatario"
            value={receiver}
            onChange={(e) => setReceiver(e.target.value)}
          />
          <textarea
            placeholder="Escribe un mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button onClick={sendMessage}>Enviar</button>

          <h2>Historial de Mensajes</h2>
          <ul>
            {messages.length > 0 ? (
              messages.map((msg, index) => (
                <li key={index}>
                  <strong>Para: {msg.receiver}</strong> - {msg.message} ({new Date(msg.timestamp).toLocaleString()})
                </li>
              ))
            ) : (
              <p>No tienes mensajes.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
