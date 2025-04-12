import { Navigate, useNavigate } from "react-router-dom";
import './styles/AdminHome.css'
import { useEffect, useState } from "react";
import React from 'react';
import { Button } from 'react-bootstrap';

function AdminHome({ user }) {
    if (user.role !== 'admin' || !user.role) {
        return <Navigate to="/" />
    }
    const home = useNavigate();

    // Variables seccion ventas
    const [ventas, setVentas] = useState([])

    // Funciones para sección de ventas
    const cargarVentas = async () => {
        try {
            const response = await fetch('http://localhost:4000/v1/restaurante/ventas/listar')
            const data = await response.json()
            setVentas(data)
        } catch (error) {
            console.error('Error al cargar ventas:', error)
        }
    }

    useEffect(() => {
        cargarVentas();
    }, [])

    function goHome() {
        home("/");
    }

    // Define la función cargarHistorial si es necesario
    const cargarHistorial = () => {
        // Lógica para cargar el historial
    };

    return (
        <div className="admin-container">
            <div className="header">
                <h1>Vista Admin</h1>

                <div className="d-flex justify-content-end mb-4 mt-5">
                    <Button variant="info" onClick={cargarHistorial}>
                        Actualizar
                    </Button>
                </div>
            </div>

            <div className="table-container">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Fecha</th>
                            <th>Usuario</th>
                            <th>Venta</th>
                            <th>Producto</th>
                            <th>Estado</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ventas.map((venta) => (
                            <tr key={venta._id}>
                                <td>{new Date(venta.fecha).toLocaleDateString('es-ES')}</td>
                                <td>{venta.nombre|| venta.usuario?.email || 'N/A'}</td>
                                <td>${venta.valor}</td>
                                <td>{venta.producto}</td>
                                <td><span className={`badge px-3 py-2 rounded-pill fw-semibold ${venta.estado === 'Aprobado'? 'bg-success text-white': 'bg-danger text-white'}`}>{venta.estado} </span></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="home-btn" onClick={goHome}>
                Home
            </button>
        </div>
    )
}

export default AdminHome;