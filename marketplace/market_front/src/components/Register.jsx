import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Form.css';

function Register() {
    const navigate = useNavigate();
    const [nombre, setNombre] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('usuario');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:4000/v1/restaurante/usuarios/crear-usuario', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nombre,
                    email,
                    password,
                    role
                }),
            });

            const data = await response.json();

            if (response.ok) {
                // Registro exitoso
                alert('Registro exitoso! Por favor inicia sesión.');
                navigate('/');
            } else {
                setError(data.mensaje || 'Error en el registro');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <h1 id="txtBienvenida">Registro de Usuario</h1>
                {error && <div className="alert alert-danger">{error}</div>}
                
                <h4 className="txt">Nombre</h4>
                <input
                    type="text"
                    className="entry"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                />
                <br />

                <h4 className="txt">Email</h4>
                <input
                    type="email"
                    className="entry"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <br />

                <h4 className="txt">Contraseña</h4>
                <input
                    type="password"
                    className="entry"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <br />

                <h4 className="txt">Tipo de Usuario</h4>
                <select
                    className="entry"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ width: 'auto' }}
                >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Administrador</option>
                </select>
                <br />

                <input type="submit" value="Registrarse" id="btnEnviar" />
                <br />
                <button
                    type="button"
                    className="txt"
                    style={{ 
                        marginTop: '10px', 
                        background: 'none',
                        border: 'none',
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer'
                    }}
                    onClick={() => navigate('/')}
                >
                    ¿Ya tienes cuenta? Inicia sesión
                </button>
            </form>
        </div>
    );
}

export default Register; 