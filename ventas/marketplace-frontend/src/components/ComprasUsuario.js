import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaShoppingCart, FaHistory } from "react-icons/fa";
import "../styles/compras.css";

const ComprasUsuario = () => {
  const [producto, setProducto] = useState("");
  const [valor, setValor] = useState("");
  const [historial, setHistorial] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      obtenerHistorial();
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
  
    const rol = localStorage.getItem("rol");
    if (rol === "admin") {
      navigate("/admin-ventas");
    }
  }, [token, navigate]);
  


  const handlePagar = (producto, valor) => {
    navigate("/pasarela", { state: { producto, valor } });
  };

  const obtenerHistorial = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/ventas", {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      setHistorial(response.data);
    } catch (error) {
      console.error("Error al obtener historial", error);
    }
  };

  const realizarCompra = async () => {
    if (!producto || !valor) {
      alert("Debe completar todos los campos.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/ventas",
        { producto, valor },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert("Compra registrada. Continúa con el pago.");
      obtenerHistorial();
    } catch (error) {
      console.error("Error al comprar", error);
    }
  };

  return (
    <div className="compra-container">
    <h2><FaShoppingCart /> Realizar Compra</h2>
    <div className="form-group">
      <input
        type="text"
        placeholder="Nombre del Producto"
        value={producto}
        onChange={(e) => setProducto(e.target.value)}
      />
      <input
        type="number"
        placeholder="Valor"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
      />
      <button className="btn" onClick={() => handlePagar(producto, valor)}>
        💳 Registrar Compra
      </button>
    </div>

    <h2><FaHistory /> Historial de Compras</h2>
    <div className="tabla-container">
      <table className="styled-table">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Producto</th>
            <th>Valor</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {historial.length > 0 ? (
            historial.map((compra) => (
              <tr key={compra._id}>
                <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                <td>{compra.producto}</td>
                <td>${compra.valor}</td>
                <td><strong>{compra.estado}</strong></td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No tienes compras registradas.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  </div>
);
};

export default ComprasUsuario;
