import { useEffect, useState } from 'react'
import api from '../api'
import './History.css'

function History() {
  const [compras, setCompras] = useState([])
  const userId = localStorage.getItem('userId')

  const fetchCompras = async () => {
    const res = await api.get(`/ventas/usuario/${userId}`)
    setCompras(res.data)
  }

  useEffect(() => {
    fetchCompras()
  }, [])

  return (
    <div className="history-bg">
      <div className="container py-5">
        <div className="card shadow-lg p-4 history-card animate__animated animate__fadeIn">
          <h2 className="text-center text-dark mb-4">
            <i className="bi bi-clock-history me-2"></i>Historial de Compras
          </h2>

          <button className="btn btn-outline-primary mb-3" onClick={fetchCompras}>
            <i className="bi bi-arrow-clockwise me-1"></i>Actualizar historial
          </button>

          <div className="table-responsive">
            <table className="table table-bordered text-center">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Producto</th>
                  <th>Valor</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {compras.length === 0 ? (
                  <tr>
                    <td colSpan="4">Sin compras registradas</td>
                  </tr>
                ) : (
                  compras.map((c) => (
                    <tr key={c._id}>
                      <td>{new Date(c.fecha).toLocaleString()}</td>
                      <td>{c.producto}</td>
                      <td>${c.valor}</td>
                      <td className={`fw-bold text-${c.estado === 'Aceptado' ? 'success' : 'danger'}`}>{c.estado}</td>
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

export default History
