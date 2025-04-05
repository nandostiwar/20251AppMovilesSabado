import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { FaCreditCard, FaUser, FaPhone, FaIdCard } from "react-icons/fa";
import "../styles/pagos.css";

const PasarelaPago = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Recibimos los datos de la compra desde la página anterior
  const { valor, producto } = location.state || { valor: 0, producto: "" };

  // Estado para los datos del formulario
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [telefono, setTelefono] = useState("");
  const [tarjeta, setTarjeta] = useState("");
  const [fecha, setFecha] = useState("");
  const [ccv, setCcv] = useState("");

  const handlePago = async () => {
    try {
      const response = await axios.post("http://localhost:5000/api/ventas/nuevaVenta", {
        valor: Number(valor), // Asegúrate de que sea un número
        producto,
        nombre,
        cedula,
        telefono,
        tarjeta,
        fecha,
        ccv,
      });
      

      // 🟢 El backend devuelve el estado de la transacción
      const { estado } = response.data;
      
      alert(estado === "Aprobada" ? "Pago exitoso" : "Pago rechazado, intenta con otra tarjeta");
      navigate("/compras"); 
    } catch (error) {
      alert("Error en la transacción");
    }
  };

  return (
    <div className="pasarela-container">
    <h2><FaCreditCard /> Pasarela de Pago</h2>

    <div className="resumen">
      <p>🛍️ Producto: <strong>{producto}</strong></p>
      <p>💰 Valor: <strong>${valor}</strong></p>
    </div>

    <div className="form-group">
      <input type="text" placeholder="👤 Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} />
      <input type="text" placeholder="🆔 Cédula" value={cedula} onChange={(e) => setCedula(e.target.value)} />
      <input type="text" placeholder="📞 Teléfono" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
      <input type="text" placeholder="💳 Número de Tarjeta" value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} />
      <input type="text" placeholder="📅 Fecha de Expiración (MM/YY)" value={fecha} onChange={(e) => setFecha(e.target.value)} />
      <input type="text" placeholder="🔒 CVV" value={ccv} onChange={(e) => setCcv(e.target.value)} />

      <button className="btn-pagar" onClick={handlePago}>💸 Confirmar Pago</button>
    </div>
  </div>
);
};
export default PasarelaPago;