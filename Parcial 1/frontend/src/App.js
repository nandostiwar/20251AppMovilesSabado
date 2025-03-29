import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Marketplace from './pages/Marketplace'
import Payment from './pages/Payment'
import History from './pages/History'
import AdminDashboard from './pages/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas para usuarios */}
        <Route
          path="/marketplace"
          element={
            <ProtectedRoute role="usuario">
              <Marketplace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pago"
          element={
            <ProtectedRoute role="usuario">
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/historial"
          element={
            <ProtectedRoute role="usuario">
              <History />
            </ProtectedRoute>
          }
        />

        {/* Ruta protegida para admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
