# Aplicación de Envío de Correos

Esta aplicación permite enviar correos electrónicos utilizando Node.js, Express, Nodemailer y React.

## Configuración

### Backend

1. Navega al directorio `backend`:
   ```
   cd backend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

3. Crea un archivo `.env` basado en el ejemplo:
   ```
   cp .env.example .env
   ```

4. Edita el archivo `.env` con tus credenciales:
   - `EMAIL_USER`: Tu dirección de Gmail
   - `EMAIL_PASS`: Tu contraseña de aplicación de Google
   - `PORT`: Puerto para el servidor (opcional, por defecto 5000)

### Frontend

1. Navega al directorio `frontend`:
   ```
   cd frontend
   ```

2. Instala las dependencias:
   ```
   npm install
   ```

## Obtener contraseña de aplicación para Gmail

1. Ve a la configuración de tu cuenta de Google
2. Busca "Contraseñas de aplicaciones" dentro de "Seguridad"
3. Selecciona "Correo" como aplicación y "Otro" como dispositivo
4. Dale un nombre descriptivo y generará una contraseña de 16 caracteres
5. Usa esa contraseña en tu archivo `.env`

## Ejecutar la aplicación

### Backend

```
cd backend
npm start
```

### Frontend

```
cd frontend
npm start
```

La aplicación estará disponible en `http://localhost:3000`.
