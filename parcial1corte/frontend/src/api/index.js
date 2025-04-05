import axios from 'axios';

// Función para obtener el puerto del backend
const getAPIPort = () => {
    // Intenta los puertos en orden hasta encontrar uno que responda
    const ports = [5000, 5001, 5002];
    return Promise.any(
        ports.map(port =>
            axios.get(`http://localhost:${port}/api/health-check`)
                .then(() => port)
                .catch(() => Promise.reject(port))
        )
    ).catch(() => 5000); // Si ninguno responde, usa el puerto por defecto
};

// Crear instancia de axios con la URL base
const api = axios.create({
    baseURL: 'http://localhost:5000/api' // Puerto por defecto
});

// Interceptor para manejar errores de conexión y actualizar el puerto si es necesario
api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Si hay un error de conexión, intenta otros puertos
    try {
        await axios.get(config.baseURL.replace('/api', '/api/health-check'));
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            const port = await getAPIPort();
            config.baseURL = `http://localhost:${port}/api`;
        }
    }
    
    return config;
});

// Servicios de autenticación
export const authService = {
    registro: (datos) => api.post('/auth/registro', datos),
    login: (datos) => api.post('/auth/login', datos)
};

// Servicios de ventas
export const ventasService = {
    crear: (datos) => api.post('/ventas', datos),
    obtenerMisVentas: () => api.get('/ventas/mis-ventas'),
    obtenerTodas: () => api.get('/ventas'),
    actualizarEstado: (id, estado) => api.put(`/ventas/${id}/estado`, { estado })
};