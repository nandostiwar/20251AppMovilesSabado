import React, { useState, useContext, useEffect } from 'react';
import { Container, Form, Button, Card, Alert, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const PurchaseForm = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Verificar si se recibió un producto desde otra página
  const selectedProduct = location.state?.product;
  
  const [formData, setFormData] = useState({
    product: selectedProduct?.name || '',
    amount: selectedProduct?.price || ''
  });
  
  // Estado para el formulario de pago
  const [paymentForm, setPaymentForm] = useState({
    customerName: user?.name || '',
    identificationNumber: '',
    phoneNumber: '',
    cardNumber: '',
    expirationDate: '',
    cvv: ''
  });

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentError, setPaymentError] = useState('');
  const [success, setSuccess] = useState('');

  // Tarjeta predefinida para validación (en un entorno real esto estaría en el backend)
  const validCard = {
    number: '4111111111111111',
    expDate: '12/25',
    cvv: '123'
  };

  const { product, amount } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e) => {
    setPaymentForm({
      ...paymentForm,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    // Redirigir si no hay usuario autenticado
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleShowPaymentForm = (e) => {
    e.preventDefault();
    setError('');
    
    // Validaciones básicas antes de mostrar formulario de pago
    if (!product.trim() || !amount) {
      return setError('El nombre del producto y el monto son obligatorios');
    }

    if (isNaN(amount) || parseFloat(amount) <= 0) {
      return setError('El monto debe ser un número mayor que 0');
    }

    // Mostrar modal de pago
    setShowPaymentModal(true);
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentError('');
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setPaymentError('');

    const { customerName, identificationNumber, phoneNumber, cardNumber, expirationDate, cvv } = paymentForm;

    // Validaciones básicas
    if (!customerName || !identificationNumber || !phoneNumber) {
      return setPaymentError('Todos los datos personales son obligatorios');
    }

    if (!cardNumber || !expirationDate || !cvv) {
      return setPaymentError('Todos los datos de la tarjeta son obligatorios');
    }

    // Validar formato de tarjeta (simplificada)
    if (cardNumber.replace(/\s/g, '').length !== 16) {
      return setPaymentError('El número de tarjeta debe tener 16 dígitos');
    }

    // Validar contra tarjeta predefinida
    const isValidCard = 
      cardNumber.replace(/\s/g, '') === validCard.number &&
      expirationDate === validCard.expDate &&
      cvv === validCard.cvv;

    if (!isValidCard) {
      return setPaymentError('Los datos de la tarjeta no son válidos. Compra declinada.');
    }

    try {
      setLoading(true);
      
      // Configurar el encabezado de autorización
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };
      
      const purchaseData = {
        product: product.trim(),
        amount: parseFloat(amount),
        customerName: customerName.trim(),
        identificationNumber: identificationNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        cardNumber: cardNumber.replace(/\s/g, ''), // Eliminar espacios
        expirationDate: expirationDate.trim()
      };
      
      const response = await axios.post('/api/purchases', purchaseData, config);
      
      setSuccess('¡Compra realizada exitosamente!');
      setFormData({
        product: '',
        amount: ''
      });
      
      // Cerrar modal de pago
      setShowPaymentModal(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/my-purchases');
      }, 2000);
    } catch (err) {
      console.error('Error al realizar la compra:', err);
      setPaymentError(
        err.response?.data?.error || 
        'Error al procesar la compra. Verifica tu conexión e inténtalo nuevamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="my-5">
  <Card className="shadow-lg border-0">
    <Card.Header as="h2" className="text-center bg-primary text-white">
      Procesar Compra
    </Card.Header>
    <Card.Body>
      <Form onSubmit={handleShowPaymentForm}>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form.Group className="mb-3" controlId="product">
          <Form.Label className="fw-bold">Producto*</Form.Label>
          <Form.Control
            type="text"
            name="product"
            value={product}
            onChange={handleChange}
            placeholder="Escribe el nombre del producto"
            required
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="amount">
          <Form.Label className="fw-bold">Total a Pagar*</Form.Label>
          <Form.Control
            type="number"
            name="amount"
            value={amount}
            onChange={handleChange}
            placeholder="Introduce el monto"
            min="0.01"
            step="0.01"
            required
          />
        </Form.Group>

        <div className="d-grid gap-2">
          <Button variant="primary" type="submit" disabled={loading || success}>
            Confirmar Compra
          </Button>
          <Button variant="outline-danger" onClick={() => navigate("/")} disabled={loading || success}>
            Cancelar Pedido
          </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)} backdrop="static" size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Formulario de Pago</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentError && <Alert variant="danger">{paymentError}</Alert>}

          <Form onSubmit={handleSubmitPayment}>
            <h5 className="mb-3">Detalles de la Compra</h5>
            <Row className="mb-4">
              <Col md={6}><Form.Control type="text" value={product} disabled readOnly /></Col>
              <Col md={6}><Form.Control type="text" value={`$${parseFloat(amount).toFixed(2)}`} disabled readOnly /></Col>
            </Row>

            <h5 className="mb-3">Datos Personales</h5>
            <Row className="mb-3">
              <Col md={6}><Form.Control type="text" name="customerName" value={paymentForm.customerName} onChange={handlePaymentChange} placeholder="Nombre Completo" required /></Col>
              <Col md={6}><Form.Control type="text" name="identificationNumber" value={paymentForm.identificationNumber} onChange={handlePaymentChange} placeholder="Cédula/ID" required /></Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}><Form.Control type="tel" name="phoneNumber" value={paymentForm.phoneNumber} onChange={handlePaymentChange} placeholder="Teléfono" required /></Col>
            </Row>

            <h5 className="mb-3">Detalles de la Tarjeta</h5>
            <Row className="mb-3">
              <Col md={12}><Form.Control type="text" name="cardNumber" value={paymentForm.cardNumber} onChange={handlePaymentChange} placeholder="Número de Tarjeta" maxLength="19" required /></Col>
            </Row>

            <Row className="mb-4">
              <Col md={6}><Form.Control type="text" name="expirationDate" value={paymentForm.expirationDate} onChange={handlePaymentChange} placeholder="MM/AA" maxLength="5" required /></Col>
              <Col md={6}><Form.Control type="password" name="cvv" value={paymentForm.cvv} onChange={handlePaymentChange} placeholder="CVV" maxLength="4" required /></Col>
            </Row>

            <div className="d-grid gap-2">
              <Button variant="success" type="submit" disabled={loading}>
                {loading ? "Procesando pago..." : "Confirmar Pago"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default PurchaseForm;
