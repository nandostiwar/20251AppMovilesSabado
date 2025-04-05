import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PasarelaPago = ({ producto, onCompraCompletada, onCancelar }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        cedula: '',
        telefono: '',
        numeroTarjeta: '',
        fechaVencimiento: '',
        ccv: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        let value = e.target.value;
        const name = e.target.name;

        // Validaciones específicas por campo
        if (name === 'numeroTarjeta') {
            // Solo permitir números y limitar a 16 dígitos
            value = value.replace(/\D/g, '').slice(0, 16);
        } else if (name === 'fechaVencimiento') {
            // Formato MM/YYYY automático
            value = value.replace(/\D/g, '');
            if (value.length > 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 6);
            }
        } else if (name === 'ccv') {
            // Solo permitir números y limitar a 3 dígitos
            value = value.replace(/\D/g, '').slice(0, 3);
        }

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validarTarjeta = () => {
        // Validar longitud del número de tarjeta (13-16 dígitos)
        const numeroValido = formData.numeroTarjeta.length >= 13 && formData.numeroTarjeta.length <= 16;
        
        // Validar formato de fecha MM/YYYY
        const fechaRegex = /^(0[1-9]|1[0-2])\/([2-9][0-9]{3})$/;
        const fechaValida = fechaRegex.test(formData.fechaVencimiento);
        
        // Validar que la fecha no sea pasada
        if (fechaValida) {
            const [mes, anio] = formData.fechaVencimiento.split('/');
            const fechaTarjeta = new Date(parseInt(anio), parseInt(mes) - 1);
            const hoy = new Date();
            if (fechaTarjeta < hoy) {
                setError('La tarjeta ha caducado');
                return false;
            }
        }
        
        // Validar CCV (3 dígitos)
        const ccvValido = formData.ccv.length === 3;

        if (!numeroValido) {
            setError('El número de tarjeta debe tener entre 13 y 16 dígitos');
            return false;
        }
        if (!fechaValida) {
            setError('La fecha debe tener el formato MM/YYYY (ejemplo: 05/2030)');
            return false;
        }
        if (!ccvValido) {
            setError('El CCV debe tener 3 dígitos');
            return false;
        }

        return true;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validarTarjeta()) {
            onCompraCompletada('tarjeta');
        }
    };

    return (
        <div className="pasarela-pago">
            <h3>Confirmar Compra</h3>
            
            <div className="detalles-producto">
                <p><strong>Producto:</strong> {producto.nombre}</p>
                <p><strong>Valor:</strong> ${producto.valor}</p>
            </div>

            {error && <p className="error">{error}</p>}

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre completo"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <input
                        type="text"
                        name="cedula"
                        placeholder="Número de cédula"
                        value={formData.cedula}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="tel"
                        name="telefono"
                        placeholder="Número de teléfono"
                        value={formData.telefono}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="numeroTarjeta"
                        placeholder="Número de tarjeta (13-16 dígitos)"
                        value={formData.numeroTarjeta}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="fechaVencimiento"
                        placeholder="Fecha de vencimiento (MM/YYYY)"
                        value={formData.fechaVencimiento}
                        onChange={handleChange}
                        maxLength="7"
                        required
                    />
                </div>

                <div className="form-group">
                    <input
                        type="text"
                        name="ccv"
                        placeholder="CCV (3 dígitos)"
                        value={formData.ccv}
                        onChange={handleChange}
                        maxLength="3"
                        required
                    />
                </div>

                <div className="metodos-pago">
                    <button type="submit">Confirmar Pago</button>
                    <button type="button" className="cancelar" onClick={onCancelar}>Cancelar</button>
                </div>
            </form>
        </div>
    );
};

const Marketplace = ({ usuario }) => {
    const [producto, setProducto] = useState({
        nombre: '',
        valor: ''
    });
    const [compras, setCompras] = useState([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [mostrarPasarela, setMostrarPasarela] = useState(false);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [actualizando, setActualizando] = useState(false);

    useEffect(() => {
        cargarCompras();
    }, []);

    const cargarCompras = async () => {
        try {
            setActualizando(true);
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:5000/api/ventas/mis-ventas', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setCompras(response.data);
            setMensaje('Lista de compras actualizada');
            // Limpiar el mensaje después de 3 segundos
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            setError('Error al cargar las compras');
        } finally {
            setActualizando(false);
        }
    };

    const handleChange = (e) => {
        setProducto({
            ...producto,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProductoSeleccionado(producto);
        setMostrarPasarela(true);
    };

    const realizarCompra = async (metodoPago) => {
        try {
            const token = localStorage.getItem('token');
            await axios.post('http://localhost:5000/api/ventas', 
                { 
                    ...productoSeleccionado,
                    metodoPago 
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            setMensaje('Compra realizada con éxito');
            setProducto({ nombre: '', valor: '' });
            setMostrarPasarela(false);
            cargarCompras();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al realizar la compra');
        }
    };

    if (mostrarPasarela) {
        return (
            <PasarelaPago
                producto={productoSeleccionado}
                onCompraCompletada={realizarCompra}
                onCancelar={() => setMostrarPasarela(false)}
            />
        );
    }

    return (
        <div className="marketplace">
            <h2>Realizar Compra</h2>
            {error && <p className="error">{error}</p>}
            {mensaje && <p className="success">{mensaje}</p>}
            
            <form onSubmit={handleSubmit} className="product-form">
                <div className="form-group">
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Nombre del producto"
                        value={producto.nombre}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className="form-group">
                    <input
                        type="number"
                        name="valor"
                        placeholder="Valor del producto"
                        value={producto.valor}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                </div>
                
                <button type="submit">Pagar</button>
            </form>

            <div className="mis-compras">
                <div className="compras-header">
                    <h3>Historial de Compras</h3>
                    <button 
                        onClick={cargarCompras}
                        className="btn-actualizar-lista"
                        disabled={actualizando}
                    >
                        {actualizando ? 'Actualizando...' : 'Actualizar Lista'}
                    </button>
                </div>
                {compras.length === 0 ? (
                    <p>No has realizado compras aún</p>
                ) : (
                    <table className="compras-table">
                        <thead>
                            <tr>
                                <th>Fecha</th>
                                <th>Producto</th>
                                <th>Valor</th>
                                <th>Estado</th>
                            </tr>
                        </thead>
                        <tbody>
                            {compras.map((compra) => (
                                <tr key={compra._id}>
                                    <td>{new Date(compra.fecha).toLocaleDateString()}</td>
                                    <td>{compra.producto.nombre}</td>
                                    <td>${compra.producto.valor}</td>
                                    <td>{compra.estado}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Marketplace;