import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/admin.css"; // Ajusta la ruta si está en otra carpeta
import { useNavigate } from "react-router-dom";

 

const AdminVentas = () => {
  const [ventas, setVentas] = useState([]);

  const navigate = useNavigate(); // ✅ define navigate aquí
  const handleCerrarSesion = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  
  useEffect(() => {
    obtenerVentas();
  }, []);

  const obtenerVentas = async () => {
    try {
      const token = localStorage.getItem("token"); // Obtener el token del almacenamiento local
      const response = await axios.get("http://localhost:5000/api/ventas", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setVentas(response.data);
    } catch (error) {
      console.error("Error obteniendo ventas:", error);
    }
  };
  

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5000/api/ventas/${id}`, 
        { estado: nuevoEstado }, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      obtenerVentas(); // Refrescar la lista
    } catch (error) {
      console.error("Error actualizando la venta:", error);
    }
  };

  return (
    <div className="admin-container">
    <h2>Administración de Ventas</h2>

    <button className="recargar" onClick={() => window.location.reload()}>
  🔄 Actualizar Página
</button>

<button className="cerrar-sesion" onClick={handleCerrarSesion}>
  🚪 Cerrar Sesión
</button>


    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Usuario</th>
          <th>Producto</th>
          <th>Valor</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {ventas.map((venta) => (
          <tr key={venta._id}>
            <td>{new Date(venta.fecha).toLocaleDateString()}</td>
            <td>{venta.nombre}</td>
            <td>{venta.producto}</td>
            <td>${venta.valor}</td>
            <td>{venta.estado}</td>
            <td>
              <button className="aprobar" onClick={() => actualizarEstado(venta._id, "Aprobada")}>
                ✅ Aprobar
              </button>
              <button className="rechazar" onClick={() => actualizarEstado(venta._id, "Rechazada")}>
                ❌ Rechazar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  
  );
};

export default AdminVentas;
