import React, { useState } from 'react';
import './App.css';
import EmailForm from './components/EmailForm';
import Notification from './components/Notification';

function App() {
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    
    // Ocultar la notificación después de 5 segundos
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 5000);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Envío de Correos Electrónicos</h1>
      </header>
      <main>
        {notification.show && (
          <Notification 
            message={notification.message} 
            type={notification.type} 
          />
        )}
        <EmailForm showNotification={showNotification} />
      </main>
    </div>
  );
}

export default App;
