import { useState, useEffect } from 'react';

function ListaMensajes({ refresh }) {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    const fetchMensajes = async () => {
      const response = await fetch('http://localhost:5000/mensajes');
      const data = await response.json();
      setMensajes(data);
    };
    fetchMensajes();
  }, [refresh]);

  return (
    <div className="p-4">
      <h2 className="text-xl mb-4">Mensajes</h2>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2">Origen</th>
            <th className="py-2">Destino</th>
            <th className="py-2">Mensaje</th>
          </tr>
        </thead>
        <tbody>
          {mensajes.map((mensaje) => (
            <tr key={mensaje._id}>
              <td className="border px-4 py-2">{mensaje.origen}</td>
              <td className="border px-4 py-2">{mensaje.destino}</td>
              <td className="border px-4 py-2">{mensaje.mensaje}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListaMensajes; 