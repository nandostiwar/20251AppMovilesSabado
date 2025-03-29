import { useState } from 'react'
import './App.css'
import RegistroUsuario from './components/RegistroUsuario';
import EnviarMensaje from './components/EnviarMensaje';
import ListaMensajes from './components/ListaMensajes';

function App() {
  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => {
    setRefresh(!refresh);
  };

  return (
    <div className="container mx-auto p-4">
      
      <h1 className="text-2xl font-bold mb-4">Aplicación de Mensajes</h1>
      <RegistroUsuario />
      <EnviarMensaje onMessageSent={handleRefresh} />
      <ListaMensajes refresh={refresh} />
    </div>
  )
}

export default App
