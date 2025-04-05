import React, { useState, useEffect, useContext } from 'react';
import { Container, Table, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PurchasesList = ({ isAdmin = false }) => {
  const { user, token } = useContext(AuthContext);
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (token) {
      fetchPurchases();
    }
  }, [token]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      
      const response = await axios.get('/api/purchases', config);
      
      // Usar el campo status del backend si existe, sino asignar uno aleatorio para demo
      const purchasesWithStatus = response.data.map(purchase => {
        if (purchase.status) {
          return purchase;
        } else {
          // Para demostración, asignamos estado aleatoriamente 
          // (en producción, esto debería venir del backend)
          const status = Math.random() > 0.3 ? 'completada' : 'rechazada';
          return { ...purchase, status };
        }
      });
      
      setPurchases(purchasesWithStatus);
      setError(null);
    } catch (err) {
      console.error('Error al obtener compras:', err);
      setError('No se pudieron cargar las compras. Por favor, intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPurchases();
  };

  const handleDeletePurchase = async (purchaseId) => {
    if (!isAdmin) return;
    
    if (window.confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        
        await axios.delete(`/api/purchases/${purchaseId}`, config);
        setPurchases(purchases.filter(purchase => purchase._id !== purchaseId));
      } catch (err) {
        console.error('Error al eliminar compra:', err);
        alert('No se pudo eliminar la compra');
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  // Función para renderizar el badge de estado con el color adecuado
  const renderStatusBadge = (status) => {
    if (status === 'completada') {
      return <Badge bg="success">Completada</Badge>;
    } else {
      return <Badge bg="danger">Rechazada</Badge>;
    }
  };

  if (loading && !refreshing) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" variant="primary">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
        <p className="mt-2">Cargando compras...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">{error}</Alert>
        <Button variant="primary" onClick={fetchPurchases}>
          Intentar de nuevo
        </Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {isAdmin ? 'Todas las Compras' : 'Mis Compras'}
        </h2>
        <Button 
          variant="outline-primary" 
          onClick={handleRefresh} 
          disabled={refreshing}
        >
          {refreshing ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Actualizando...
            </>
          ) : (
            <>
              <i className="bi bi-arrow-clockwise me-2"></i>
              Actualizar Compras
            </>
          )}
        </Button>
      </div>
      
      {purchases.length === 0 ? (
        <Alert variant="info">
          {isAdmin 
            ? 'No hay compras registradas en el sistema.' 
            : 'Aún no has realizado ninguna compra.'}
          <div className="mt-3">
            <Link to="/purchase">Realizar una compra</Link>
          </div>
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Estado</th>
                {isAdmin && <th>Usuario</th>}
                {isAdmin && <th>Acciones</th>}
              </tr>
            </thead>
            <tbody>
              {purchases.map(purchase => (
                <tr key={purchase._id}>
                  <td>{purchase.product}</td>
                  <td>${purchase.amount.toFixed(2)}</td>
                  <td>{formatDate(purchase.date)}</td>
                  <td>{renderStatusBadge(purchase.status)}</td>
                  {isAdmin && (
                    <td>
                      {purchase.user && 
                        `${purchase.user.name} (${purchase.user.email})`}
                    </td>
                  )}
                  {isAdmin && (
                    <td>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleDeletePurchase(purchase._id)}
                      >
                        Eliminar
                      </Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
      
      <div className="mt-4">
        <Link to="/">
          <Button variant="secondary">Volver al inicio</Button>
        </Link>
        {' '}
        <Link to="/purchase">
          <Button variant="primary">Realizar nueva compra</Button>
        </Link>
      </div>
    </Container>
  );
};

export default PurchasesList;