import './styles/Form.css'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ callback }) => {
    const [nombre, setNombre] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/v1/restaurante/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: nombre,
                    password,
                }),
            });

            const data = await response.json();
            console.log('Respuesta del servidor:', data); // Para debug

            if (response.ok) {
                callback(data);
                // Redirigir según el rol
                if (data.role === 'admin') {
                    navigate('/admin');
                } else if (data.role === 'usuario') {
                    navigate('/compras');
                }
            } else {
                setError(data.mensaje || 'Credenciales inválidas');
            }
        } catch (error) {
            console.error('Error:', error);
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1 id="txtBienvenida">Bienvenido a mi Market</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                <h4 className="txt">Usuario</h4>
                <input
                    type="text"
                    className="entry"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <br />
                <h4 className="txt mt-4" >Contraseña</h4>
                <input
                    type="password"
                    className="entry"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />
                <input type="submit" value="Ingresar" id="btnEnviar" />
                <br />
                <button
                    type="button"
                    className="txt mt-4"
                    style={{ 
                        marginTop: '10px', 
                        background: 'none',
                        border: 'none',
                        color: 'black',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/register')}
                >
                    ¿No tienes cuenta? Regístrate
                </button>
            </form>
        </div>
    );
};

export default Login;