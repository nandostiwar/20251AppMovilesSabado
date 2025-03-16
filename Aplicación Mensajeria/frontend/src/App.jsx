import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      const res = await axios.post("http://localhost:5000/login", { phone, password });
      setToken(res.data.token);
      setError("");
      fetchMessages();
    } catch (err) {
      setError("Credenciales incorrectas");
    }
  };

  const register = async () => {
    try {
      await axios.post("http://localhost:5000/register", { phone, password });
      alert("Usuario registrado");
      setError("");
    } catch (err) {
      setError("El número ya está registrado");
    }
  };

  const sendMessage = async () => {
    await axios.post("http://localhost:5000/send", { sender: phone, receiver, message });
    setMessage("");
  };

  const fetchMessages = async () => {
    const res = await axios.get(`http://localhost:5000/messages/${phone}`);
    setMessages(res.data);
  };

  const logout = () => {
    setToken(null);
    setPhone("");
    setPassword("");
    setReceiver("");
    setMessage("");
    setMessages([]);
  };

  useEffect(() => {
    if (token) fetchMessages();
  }, [token]);

  return (
    <div>
      {!token ? (
        <div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Número" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contraseña" />
          <button onClick={register}>Registrar</button>
          <button onClick={login}>Iniciar sesión</button>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      ) : (
        <div>
          <h2>Bienvenido, {phone}</h2>
          <button onClick={logout}>Cerrar sesión</button>
          <input value={receiver} onChange={(e) => setReceiver(e.target.value)} placeholder="Número destino" />
          <input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Mensaje" />
          <button onClick={sendMessage}>Enviar</button>
          <button onClick={fetchMessages}>Actualizar</button>
          <h3>Mensajes recibidos:</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg.sender}: {msg.message}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
export default App;