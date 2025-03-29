import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

function AdminDashboard({ user, onLogout }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSales();
  }, []);

  const fetchSales = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/sales/admin', {
        headers: {
          'Authorization': `Bearer ${user.id}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Error al obtener las ventas');
      }
      
      const data = await response.json();
      setSales(data);
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

  const updateSaleStatus = async (saleId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/v1/sales/${saleId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify({ estado: newStatus })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el estado de la venta');
      }

      Swal.fire({
        icon: 'success',
        title: 'Actualización exitosa',
        text: 'El estado de la venta ha sido actualizado'
      });

      fetchSales(); // Refresh sales list
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message
      });
    }
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
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="card">
          <h2 className="text-xl font-bold mb-4">Panel de Administración</h2>
          
          {loading ? (
            <p className="text-center py-1">Cargando...</p>
          ) : sales.length === 0 ? (
            <p className="text-center py-4">No hay ventas registradas</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usuario</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Producto</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sales.map((sale) => (
                    <tr key={sale._id}>
                      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(sale.fechaCompra)}
                      </td>
                      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                        {sale.usuario.name}
                      </td>
                      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                        {sale.producto}
                      </td>
                      <td className="px-6 text-right py-1 whitespace-nowrap text-sm text-gray-900">
                        ${sale.valor.toFixed(2)}
                      </td>
                      <td className="px-6 py-1 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          sale.estado === 'Aceptado' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {sale.estado}
                        </span>
                      </td>
                      <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-900">
                        <button
                          onClick={() => updateSaleStatus(sale._id, sale.estado === 'Aceptado' ? 'Declinado' : 'Aceptado')}
                          className="btn btn-secondary"
                        >
                          Cambiar Estado
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard; 