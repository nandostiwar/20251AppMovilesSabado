import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Swal from 'sweetalert2';

function PaymentGateway({ user, onLogout }) {
  const [purchaseData, setPurchaseData] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    telefono: '',
    tarjeta: {
      numero: '',
      vencimiento: '',
      ccv: ''
    },
    usuario: user._id
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Recuperar datos de la compra del localStorage
    const storedPurchase = localStorage.getItem('currentPurchase');
    if (!storedPurchase) {
      navigate('/');
      return;
    }
    
    setPurchaseData(JSON.parse(storedPurchase));
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('tarjeta.')) {
      const tarjetaField = name.split('.')[1];
      setFormData({
        ...formData,
        tarjeta: {
          ...formData.tarjeta,
          [tarjetaField]: value
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
    
      const saleData = {
        ...purchaseData,
        ...formData,
        usuario: user._id
      };

      const response = await fetch('http://localhost:5000/api/v1/sales/store-venta', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.id}`
        },
        body: JSON.stringify(saleData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al procesar el pago');
      }

      // Limpiar datos de compra del localStorage
      localStorage.removeItem('currentPurchase');

      // Mostrar mensaje según el estado de la compra
      if (data.estado === 'Aceptado') {
        Swal.fire({
          icon: 'success',
          title: '¡Pago exitoso!',
          text: 'Tu compra ha sido procesada correctamente'
        }).then(() => {
          navigate('/');
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Pago rechazado',
          text: 'La tarjeta ingresada no es válida. Por favor, intenta con otra tarjeta.'
        });
      }
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

  if (!purchaseData) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar user={user} onLogout={onLogout} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto bg-white p-6 shadow-md rounded-lg">
          <h2 className="text-2xl font-bold mb-6 text-center">Pasarela de Pago</h2>
          
          <div className="bg-gray-100 p-4 rounded-md mb-6">
            <div className="flex justify-between mb-2">
              <span className="font-medium">Producto:</span>
              <span>{purchaseData.producto}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Valor:</span>
              <span>${purchaseData.valor.toFixed(2)}</span>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="nombre">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="cedula">
                  Cédula
                </label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="telefono">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <h3 className="text-lg font-semibold mb-4">Datos de la tarjeta</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="tarjeta.numero">
                Número de tarjeta
              </label>
              <input
                type="text"
                id="tarjeta.numero"
                name="tarjeta.numero"
                className="input w-full border border-gray-300 p-2 rounded"
                value={formData.tarjeta.numero}
                onChange={handleChange}
                placeholder="4111 1111 1111 1111"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Para pruebas, usa: 9858658998562541
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="tarjeta.vencimiento">
                  Fecha de vencimiento
                </label>
                <input
                  type="text"
                  id="tarjeta.vencimiento"
                  name="tarjeta.vencimiento"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.tarjeta.vencimiento}
                  onChange={handleChange}
                  placeholder="MM/YY"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para pruebas, usa: 12/29
                </p>
              </div>
              
              <div>
                <label className="block text-gray-700 mb-2" htmlFor="tarjeta.ccv">
                  CCV
                </label>
                <input
                  type="text"
                  id="tarjeta.ccv"
                  name="tarjeta.ccv"
                  className="input w-full border border-gray-300 p-2 rounded"
                  value={formData.tarjeta.ccv}
                  onChange={handleChange}
                  placeholder="123"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Para pruebas, usa: 596
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <button
                type="button"
                className="btn btn-secondary flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                onClick={() => navigate('/')}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="btn btn-primary flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Confirmar Pago'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default PaymentGateway; 