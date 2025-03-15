document.getElementById('registroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Captura los valores del formulario
    const nombre = document.getElementById('nombre').value;
    const correo = document.getElementById('correo').value;
    const direccion = document.getElementById('direccion').value;
    const telefono = document.getElementById('telefono').value;
    const producto = document.getElementById('producto').value;

    // Crear objetos para las colecciones
    const venta = { nombre, producto };
    const cliente = { nombre, direccion, telefono, correo };

    // Enviar datos al backend
    fetch('http://localhost:3000/api/ventas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(venta),
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        return fetch('http://localhost:3000/api/clientes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(cliente),
        });
    })
    .then(response => response.text())
    .then(message => {
        console.log(message);
        alert('Datos guardados correctamente!');
        document.getElementById('registroForm').reset();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar los datos');
    });
});