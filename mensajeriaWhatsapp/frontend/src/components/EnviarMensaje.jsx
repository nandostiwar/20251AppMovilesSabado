import { useState, useEffect } from 'react';

function EnviarMensaje({ onMessageSent }) {
  const [origen, setOrigen] = useState('');
  const [destino, setDestino] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchUsuarios = async () => {
      const response = await fetch('http://localhost:5000/usuarios');
      const data = await response.json();
      setUsuarios(data);
    };
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/mensajes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ origen, destino, mensaje }),
    });
    setOrigen('');
    setDestino('');
    setMensaje('');
    onMessageSent(); // Llama a la función para actualizar la lista de mensajes
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div>
        <label className="block">Origen:</label>
        <input
          type="text"
          value={origen}
          onChange={(e) => setOrigen(e.target.value)}
          list="usuarios"
          className="border p-2"
        />
        <datalist id="usuarios">
          {usuarios.map((usuario) => (
            <option key={usuario._id} value={usuario.nombre} />
          ))}
        </datalist>
      </div>
      <div>
        <label className="block">Destino:</label>
        <input
          type="text"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
          list="usuarios"
          className="border p-2"
        />
      </div>
      <div>
        <label className="block">Mensaje:</label>
        <textarea
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          className="border p-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
        Enviar
      </button>
    </form>
  );
}

export default EnviarMensaje; 