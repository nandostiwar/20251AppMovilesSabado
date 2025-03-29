import { useEffect, useState } from 'react'
import api from '../api'
import './AdminDashboard.css'

function AdminDashboard() {
  const [ventas, setVentas] = useState([])

  const fetchVentas = async () => {
    const res = await api.get('/ventas/admin/todas')
    setVentas(res.data)
  }

  const actualizarEstado = async (id, estado) => {
    await api.put('/ventas/admin/actualizar', { ventaId: id, estado })
    fetchVentas()
  }

  useEffect(() => {
    fetchVentas()
  }, [])

  return (
    <div className="admin-bg">
      <div className="container py-5">
        <div className="card shadow-lg p-4 admin-card animate__animated animate__fadeIn">
          <h2 className="text-center text-dark mb-4">
            <i className="bi bi-shield-check me-2"></i>Panel del Administrador
          </h2>

          <button className="btn btn-outline-primary mb-3" onClick={fetchVentas}>
            <i className="bi bi-arrow-clockwise me-1"></i>Actualizar ventas
          </button>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
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
                {ventas.length === 0 ? (
                  <tr>
                    <td colSpan="6">Sin ventas registradas</td>
                  </tr>
                ) : (
                  ventas.map((v) => (
                    <tr key={v._id}>
                      <td>{new Date(v.fecha).toLocaleString()}</td>
                      <td>{v.usuario?.nombre || 'Desconocido'}</td>
                      <td>{v.producto}</td>
                      <td>${v.valor}</td>
                      <td className={`fw-bold text-${v.estado === 'Aceptado' ? 'success' : v.estado === 'Declinado' ? 'danger' : 'secondary'}`}>{v.estado}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-success me-2"
                          onClick={() => actualizarEstado(v._id, 'Aceptado')}
                        >
                          Aceptar
                        </button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => actualizarEstado(v._id, 'Declinado')}
                        >
                          Rechazar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <button
            className="btn btn-outline-secondary mt-3"
            onClick={() => window.history.back()}
          >
            <i className="bi bi-arrow-left me-1"></i>Volver
          </button>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
