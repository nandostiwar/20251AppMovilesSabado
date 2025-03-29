import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Marketplace.css'

function Marketplace() {
  const [producto, setProducto] = useState('')
  const [valor, setValor] = useState('')
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
    if (producto && valor) {
      localStorage.setItem('producto', producto)
      localStorage.setItem('valor', valor)
      navigate('/pago')
    }
  }

  return (
    <div className="marketplace-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card marketplace-card shadow-lg p-4 animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <i className="bi bi-cart4 fs-1 text-primary"></i>
            <h2 className="fw-bold mt-2">Realizar Compra</h2>
            <p className="text-muted">Ingresa los datos del producto</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Producto</label>
              <input
                type="text"
                className="form-control"
                value={producto}
                onChange={(e) => setProducto(e.target.value)}
                placeholder="Ej: Teclado gamer"
                required
              />
            </div>
            <div className="mb-4">
              <label>Valor ($)</label>
              <input
                type="number"
                className="form-control"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="Ej: 150000"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-100">
              Ir a pagar
            </button>
            <p className="text-center mt-4 small">
              <a href="/historial" className="text-decoration-none">Ver historial de compras</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Marketplace
