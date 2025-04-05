import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Componentes de autenticación
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Componentes principales
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './components/Home';

// Componentes de productos y compras
import ProductList from './components/products/ProductList';
import ProductDetail from './components/products/ProductDetail';
import AddProduct from './components/products/AddProduct';
import PurchaseForm from './components/purchases/PurchaseForm';
import PurchasesList from './components/purchases/PurchasesList';

// Contexto de autenticación
import { AuthContext } from './context/AuthContext';

function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [loading, setLoading] = useState(true);

  // Verificar si hay un usuario en localStorage al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser && token) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, [token]);

  // Función para login
  const login = (userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);
  };

  // Función para logout
  const logout = () => {
    setUser(null);
    setToken('');
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  // Ruta protegida que verifica autenticación
  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" />;
  };

  // Ruta protegida que verifica rol de administrador
  const AdminRoute = ({ children }) => {
    return user && user.role === 'admin' ? children : <Navigate to="/" />;
  };

  if (loading) {
    return <div className="loading">Cargando...</div>;
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      <div className="App">
        <Header />
        <main className="container mt-4">
          <Routes>
            {/* Rutas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:id" element={<ProductDetail />} />

            {/* Rutas protegidas (usuario autenticado) */}
            <Route 
              path="/purchase" 
              element={
                <PrivateRoute>
                  <PurchaseForm />
                </PrivateRoute>
              } 
            />
            <Route 
              path="/my-purchases" 
              element={
                <PrivateRoute>
                  <PurchasesList />
                </PrivateRoute>
              } 
            />

            {/* Rutas protegidas (solo administrador) */}
            <Route 
              path="/add-product" 
              element={
                <AdminRoute>
                  <AddProduct />
                </AdminRoute>
              } 
            />
            <Route 
              path="/admin/purchases" 
              element={
                <AdminRoute>
                  <PurchasesList isAdmin={true} />
                </AdminRoute>
              } 
            />

            {/* Ruta para páginas no encontradas */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthContext.Provider>
  );
}

export default App;