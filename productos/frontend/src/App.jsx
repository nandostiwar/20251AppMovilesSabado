import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Importamos las páginas
import Ventas from './pages/Ventas';
import Usuarios from './pages/Usuarios';
// Eliminamos la importación de Productos

function App() {
  return (
    <Router>
      <div className="app-container">
        <header className="app-header">
          <h1>RESTAURANTE EL SABROSO</h1>
        </header>
      
        <main className="app-content">
          <Routes>
            <Route path="/ventas" element={<Ventas />} />
            <Route path="/usuarios" element={<Usuarios />} />
            {/* Eliminamos la ruta de productos */}
          </Routes>
        </main>
        

      </div>
    </Router>
  );
}

export default App;
