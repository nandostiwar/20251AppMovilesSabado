import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api'
import './Payment.css'

function Payment() {
  const navigate = useNavigate()

  const producto = localStorage.getItem('producto')
  const valor = localStorage.getItem('valor')
  const userId = localStorage.getItem('userId')

  const [nombre, setNombre] = useState('')
  const [cedula, setCedula] = useState('')
  const [telefono, setTelefono] = useState('')
  const [tarjeta, setTarjeta] = useState('')
  const [vencimiento, setVencimiento] = useState('')
  const [ccv, setCcv] = useState('')
  const [estado, setEstado] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const res = await api.post('/ventas/nueva', {
        valor,
        producto,
        nombre,
        cedula,
        telefono,
        tarjeta,
        vencimiento,
        ccv,
        userId,
      })
      setEstado(res.data.estado)

      setTimeout(() => {
        navigate('/historial')
      }, 2000)
    } catch (err) {
      alert('Error al procesar el pago.')
    }
  }

  return (
    <div className="payment-bg">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card payment-card shadow-lg p-4 animate__animated animate__fadeIn">
          <div className="text-center mb-4">
            <i className="bi bi-credit-card-2-front fs-1 text-info"></i>
            <h2 className="fw-bold mt-2">Pasarela de Pago</h2>
            <p className="text-muted">Producto: <strong>{producto}</strong> — ${valor}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label>Nombre completo</label>
              <input className="form-control" value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Cédula</label>
              <input className="form-control" value={cedula} onChange={(e) => setCedula(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Teléfono</label>
              <input className="form-control" value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Número de tarjeta</label>
              <input className="form-control" value={tarjeta} onChange={(e) => setTarjeta(e.target.value)} required />
            </div>
            <div className="mb-3">
              <label>Vencimiento (MM/AA)</label>
              <input className="form-control" value={vencimiento} onChange={(e) => setVencimiento(e.target.value)} required />
            </div>
            <div className="mb-4">
              <label>CCV</label>
              <input className="form-control" value={ccv} onChange={(e) => setCcv(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-info w-100">Confirmar pago</button>
            {estado && (
              <div className={`mt-4 text-center fw-bold text-${estado === 'Aceptado' ? 'success' : 'danger'}`}>
                Resultado: {estado}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default Payment
