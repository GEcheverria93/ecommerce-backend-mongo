/* eslint-disable no-alert */

/* eslint-disable no-undef */

// Agregamos un evento al formulario de inicio de sesión
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene el comportamiento por defecto del formulario (recarga de página)

    // Recopilamos los datos del formulario
    const formData = {
        email: document.getElementById('email').value, // Obtenemos el valor del campo de email
        password: document.getElementById('password').value, // Obtenemos el valor del campo de contraseña
    };

    try {
        // Realizamos la solicitud de inicio de sesión al servidor
        const response = await fetch('/api/sessions/login', {
            method: 'POST', // Método de la solicitud
            headers: {
                'Content-Type': 'application/json', // Indicamos que el contenido es JSON
            },
            body: JSON.stringify(formData), // Convertimos los datos del formulario a JSON
        });

        // Verificamos si la respuesta fue exitosa
        if (response.ok) {
            window.location.href = '/profile'; // Redirigimos al usuario a su perfil
        } else {
            // Si hay un error, mostramos un mensaje de alerta
            const error = await response.json(); // Obtenemos el mensaje de error en formato JSON
            alert(error.message || 'Error al iniciar sesión'); // Mostramos el mensaje de error o un mensaje por defecto
        }
    } catch (error) {
        // Si ocurre un error en la conexión, mostramos un mensaje de alerta
        alert('Error al conectar con el servidor'); // Mensaje de error genérico
    }
});
