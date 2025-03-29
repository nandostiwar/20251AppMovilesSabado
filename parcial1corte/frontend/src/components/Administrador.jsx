import React, { useState, useEffect } from 'react';
import { ventasService } from '../api';

const RefreshIcon = ({ isLoading }) => (
    <svg
        className={isLoading ? "rotate" : ""}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 8A6 6 0 1 1 8 14M8 2V4M12 4L14 6M14 10L12 12M8 14V12M4 12L2 10"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

const Administrador = () => {
    const [ventas, setVentas] = useState([]);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [actualizando, setActualizando] = useState(false);

    const cargarVentas = async () => {
        try {
            setActualizando(true);
            const response = await ventasService.obtenerTodas();
            setVentas(response.data);
            setMensaje('Lista de ventas actualizada');
            setTimeout(() => setMensaje(''), 3000);
        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al cargar las ventas');
        } finally {
            setActualizando(false);
        }
    };

    useEffect(() => {
        cargarVentas();
    }, []);

    const actualizarEstadoVenta = async (ventaId, nuevoEstado) => {
        try {
            await ventasService.actualizarEstado(ventaId, nuevoEstado);
            setMensaje(`Venta ${nuevoEstado} exitosamente`);
            cargarVentas();
        } catch (error) {
            setError(error.response?.data?.mensaje || 'Error al actualizar el estado de la venta');
        }
    };

    const formatearFecha = (fecha) => {
        return new Date(fecha).toLocaleString('es-CO', {
            year: '2-digit',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    const getEstadoClase = (estado) => {
        return `estado-venta estado-${estado.toLowerCase()}`;
    };

    return (
        <div className="admin-dashboard">
            <h2>Panel de Administración</h2>
            {error && <p className="error">{error}</p>}
            {mensaje && <p className="success">{mensaje}</p>}

            <div className="ventas-header">
                <h3>Gestión de Ventas</h3>
                <button 
                    onClick={cargarVentas}
                    className={`btn-actualizar ${actualizando ? "loading" : ""}`}
                    disabled={actualizando}
                >
                    <RefreshIcon isLoading={actualizando} />
                    {actualizando ? 'Actualizando...' : 'Actualizar Lista'}
                </button>
            </div>

            <div className="ventas-table-container">
                {ventas.length === 0 ? (
                    <p>No hay ventas registradas</p>
                ) : (
                    <table className="ventas-table">
                        <thead>
                            <tr>
                                <th title="Fecha">Fecha</th>
                                <th title="Usuario">Usuario</th>
                                <th title="Producto">Producto</th>
                                <th title="Valor">Valor</th>
                                <th title="Estado">Estado</th>
                                <th title="Acciones">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventas.map((venta) => (
                                <tr key={venta._id}>
                                    <td title={formatearFecha(venta.fecha)}>{formatearFecha(venta.fecha)}</td>
                                    <td title={venta.usuario?.email || 'N/A'}>{venta.usuario?.email || 'N/A'}</td>
                                    <td title={venta.producto.nombre}>{venta.producto.nombre}</td>
                                    <td title={`$${venta.producto.valor.toLocaleString()}`}>${venta.producto.valor.toLocaleString()}</td>
                                    <td>
                                        <span className={getEstadoClase(venta.estado)}>
                                            {venta.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => actualizarEstadoVenta(venta._id, 'completada')}
                                                className="btn-aprobar"
                                                disabled={venta.estado !== 'procesando'}
                                            >
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => actualizarEstadoVenta(venta._id, 'rechazada')}
                                                className="btn-rechazar"
                                                disabled={venta.estado !== 'procesando'}
                                            >
                                                Rechazar
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default Administrador;
