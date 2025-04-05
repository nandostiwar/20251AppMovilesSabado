import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Registro from "./components/Registro";
import ComprasUsuario from "./components/ComprasUsuario";
import PasarelaPago from "./components/PasarelaPago";
import AdminVentas from "./components/AdminVentas";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/compras" element={<ComprasUsuario />} />
        <Route path="/pasarela" element={<PasarelaPago />} />
        <Route path="/admin" element={<AdminVentas />} />
      </Routes>
    </Router>
  );
}

export default App;
