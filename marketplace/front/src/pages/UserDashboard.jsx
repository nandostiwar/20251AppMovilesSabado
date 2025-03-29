import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

function UserDashboard({ user, onLogout }) {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    valor: '',
    producto: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchPurchases();
  }, []);

  const fetchPurchases = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/sales/sales-by-user/${user._id}`);

      if (!response.ok) {
        throw new Error('Error al obtener las compras');
      }
      
      const data = await response.json();
      setPurchases(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar que los campos no estén vacíos
    if (!formData.valor || !formData.producto) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Todos los campos son obligatorios'
      });
      return;
    }

    // Crear un objeto temporal para pasar a la página de pago
    const purchaseData = {
      ...formData,
      valor: parseFloat(formData.valor)
    };
    
    // Guardar en localStorage para recuperarlo en la página de pago
    localStorage.setItem('currentPurchase', JSON.stringify(purchaseData));
    
    // Navegar a la página de pago
    navigate('/payment/new');
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Formulario de compra */}
          <div className="card p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Realizar Compra</h2>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 mb-2" htmlFor="producto">
                  Producto
                </label>
                <input
                  type="text"
                  id="producto"
                  name="producto"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.producto}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-gray-700 mb-2" htmlFor="valor">
                  Valor ($)
                </label>
                <input
                  type="number"
                  id="valor"
                  name="valor"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.valor}
                  onChange={handleChange}
                  min="1"
                  step="0.01"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="btn btn-primary w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
              >
                Pagar
              </button>
            </form>
          </div>
          
          {/* Historial de compras */}
          <div className="card p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Historial de Compras</h2>
            
            {loading ? (
              <p className="text-center py-1">Cargando...</p>
            ) : purchases.length === 0 ? (
              <p className="text-center py-1">No hay compras registradas</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {purchases.map((purchase) => (
                      <tr key={purchase._id}>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(purchase.fechaCompra)}
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                          {purchase.producto}
                        </td>
                        <td className="px-6 text-right py-1 whitespace-nowrap text-sm text-gray-900">
                          ${purchase.valor.toFixed(2)}
                        </td>
                        <td className="px-6 py-1 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            purchase.estado === 'Aceptado' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {purchase.estado}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            <button
              onClick={fetchPurchases}
              className="mt-4 btn btn-secondary w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Actualizar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDashboard; 