import { useState } from 'react';

function RegistroUsuario() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost:5000/usuarios', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, telefono }),
    });
    setNombre('');
    setTelefono('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4">
      <div>
        <label className="block">Nombre:</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2"
        />
      </div>
      <div>
        <label className="block">Teléfono:</label>
        <input
          type="text"
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="border p-2"
        />
      </div>
      <button type="submit" className="bg-blue-500 text-white p-2 mt-2">
        Registrar
      </button>
    </form>
  );
}

export default RegistroUsuario; 