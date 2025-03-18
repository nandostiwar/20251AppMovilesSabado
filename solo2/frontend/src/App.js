import React, { useState } from 'react';
import './App.css';
import EmailForm from './components/EmailForm';
import UserForm from './components/UserForm';
import MensajesList from './components/MensajesList';
import Notification from './components/Notification';

function App() {
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [activeForm, setActiveForm] = useState('email'); // 'email', 'user' o 'mensajes'
  const [isEmailValid, setIsEmailValid] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  // Función para manejar la validación del email
  const handleEmailValidation = (isValid) => {
    setIsEmailValid(isValid);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión</h1>
        <div className="navigation-tabs">
          {/* <button 
            className={activeForm === 'email' ? 'active' : ''} 
            onClick={() => setActiveForm('email')}
            disabled={!isEmailValid}
          >
            Envío de Correos
            {!isEmailValid && <span className="tooltip">Necesita un email válido</span>}
          </button> */}
          <button 
            className={activeForm === 'user' ? 'active' : ''} 
            onClick={() => setActiveForm('user')}
          >
            Usuarios
          </button>
          <button 
            className={activeForm === 'mensajes' ? 'active' : ''} 
            onClick={() => setActiveForm('mensajes')}
          >
            Mensajes Enviados
          </button>
        </div>
      </header>
      <main>
        {notification.show && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
          />
        )}
        
        {activeForm === 'email' && (
          <EmailForm showNotification={showNotification} />
        )}
        
        {activeForm === 'user' && (
          <UserForm 
            showNotification={showNotification} 
            onValidEmail={handleEmailValidation} 
          />
        )}
        
        {activeForm === 'mensajes' && (
          <MensajesList showNotification={showNotification} />
        )}
      </main>
    </div>
  );
}

export default App;
