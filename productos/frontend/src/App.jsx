import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    producto: ''
  })
  const [clientes, setClientes] = useState([])
  const [ventas, setVentas] = useState([])
  const [activeTab, setActiveTab] = useState('formulario')

  useEffect(() => {
    
    if (activeTab === 'clientes') {
      fetchClientes()
    } else if (activeTab === 'ventas') {
      fetchVentas()
    }
  }, [activeTab])

  const fetchClientes = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/clientes')
      if (response.ok) {
        const data = await response.json()
        setClientes(data)
      }
    } catch (error) {
      console.error('Error al obtener clientes:', error)
    }
  }

  const fetchVentas = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/ventas')
      if (response.ok) {
        const data = await response.json()
        setVentas(data)
      }
    } catch (error) {
      console.error('Error al obtener ventas:', error)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await fetch('http://localhost:5000/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      if (response.ok) {
        alert('Datos enviados con éxito')
        setFormData({
          nombre: '',
          direccion: '',
          telefono: '',
          correo: '',
          producto: ''
        })
      } else {
        alert('Error al enviar los datos')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      {/* Navegación */}
      <div className="w-full max-w-4xl mb-6">
        <nav className="flex border-b border-gray-200">
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'formulario' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('formulario')}
          >
            Formulario
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'clientes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('clientes')}
          >
            Clientes
          </button>
          <button 
            className={`px-4 py-2 font-medium ${activeTab === 'ventas' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('ventas')}
          >
            Ventas
          </button>
        </nav>
      </div>

      {/* Contenido */}
      <div className="w-full max-w-4xl">
        {activeTab === 'formulario' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">Formulario de Venta</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input 
                  type="text" 
                  id="nombre"
                  name="nombre" 
                  placeholder="Nombre completo" 
                  value={formData.nombre} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="direccion" className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                <input 
                  type="text" 
                  id="direccion"
                  name="direccion" 
                  placeholder="Dirección completa" 
                  value={formData.direccion} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input 
                  type="tel" 
                  id="telefono"
                  name="telefono" 
                  placeholder="Número de teléfono" 
                  value={formData.telefono} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-gray-700 mb-1">Correo</label>
                <input 
                  type="email" 
                  id="correo"
                  name="correo" 
                  placeholder="Correo electrónico" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label htmlFor="producto" className="block text-sm font-medium text-gray-700 mb-1">Producto</label>
                <input 
                  type="text" 
                  id="producto"
                  name="producto" 
                  placeholder="Nombre del producto" 
                  value={formData.producto} 
                  onChange={handleChange} 
                  required 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button 
                type="submit" 
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Enviar
              </button>
            </form>
          </div>
        )}

        {activeTab === 'clientes' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h1 className="text-2xl font-bold text-center text-gray-800 p-4">Lista de Clientes</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {clientes.length > 0 ? (
                    clientes.map((cliente, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.direccion}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.telefono}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{cliente.correo}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-4 text-center text-sm text-gray-500">No hay clientes registrados</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'ventas' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <h1 className="text-2xl font-bold text-center text-gray-800 p-4">Registro de Ventas</h1>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {ventas.length > 0 ? (
                    ventas.map((venta, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.nombre}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{venta.producto}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {venta.fecha ? new Date(venta.fecha).toLocaleDateString() : 'N/A'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-center text-sm text-gray-500">No hay ventas registradas</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
