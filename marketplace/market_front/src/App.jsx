import { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'; 
import './App.css';

import AdminHome from './components/AdminHome';
import Compras from './components/Compras';
import FormPago from './components/FormPago';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [user, setUser] = useState(null);
  return (  
    <BrowserRouter>
      <Routes>
        <Route index element={<Login callback={setUser}/>}></Route>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/admin' element={<AdminHome user={user}/>}></Route>
        <Route path='/compras' element={<Compras user={user}/>}></Route>
        <Route path='/pago' element={<FormPago user={user}/>}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
