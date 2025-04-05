import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const usuario = JSON.parse(localStorage.getItem("usuario")); // Obtener info del usuario
  return usuario?.rol === "admin" ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
