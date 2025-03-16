import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await axios.get('http://localhost:5000/mensajes');
            setMessages(res.data);
        } catch (error) {
            alert('Error al obtener los mensajes');
        }
    };

    const registerUser = async () => {
        try {
            await axios.post('http://localhost:5000/usuario', { nombre, telefono });
            alert('Usuario registrado exitosamente');
            setNombre('');
            setTelefono('');
        } catch (error) {
            alert('Error al registrar usuario');
        }
    };

    const sendMessage = async () => {
        try {
            await axios.post('http://localhost:5000/mensaje', { origen, destino, mensaje });
            fetchMessages();
            setOrigen('');
            setDestino('');
            setMensaje('');
        } catch (error) {
            alert('Error al enviar mensaje');
        }
    };

    return (
      <div style={{ width: '60%', margin: 'auto', textAlign: 'center' }}>
          <h1>Sistema de Mensajería</h1>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ flex: 1, marginRight: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                  <h2>Registrar Usuario</h2>
                  <input placeholder="Nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} /><br />
                  <input placeholder="Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} /><br />
                  <button onClick={registerUser}>Registrarme</button>
              </div>
              <div style={{ flex: 1, marginLeft: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                  <h2>Enviar Mensaje</h2>
                  <input placeholder="Teléfono Origen" value={origen} onChange={(e) => setOrigen(e.target.value)} /><br />
                  <input placeholder="Teléfono Destino" value={destino} onChange={(e) => setDestino(e.target.value)} /><br />
                  <input placeholder="Mensaje" value={mensaje} onChange={(e) => setMensaje(e.target.value)} /><br />
                  <button onClick={sendMessage}>Enviar</button>
              </div>
          </div>
          <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
              <h2>Lista de Mensajes</h2>
              <table border="1" style={{ width: '100%', textAlign: 'center' }}>
                  <thead>
                      <tr>
                          <th>Origen</th>
                          <th>Destino</th>
                          <th>Mensaje</th>
                      </tr>
                  </thead>
                  <tbody>
                      {messages.map((msg, index) => (
                          <tr key={index}>
                              <td>{msg.origen}</td>
                              <td>{msg.destino}</td>
                              <td>{msg.mensaje}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
  );
}

export default App;
