/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */

// Agregamos un evento al botón de cerrar sesión
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        // Realizamos la solicitud de cierre de sesión al servidor
        const response = await fetch('/api/sessions/logout', {
            method: 'POST', // Método de la solicitud
        });

        // Verificamos si la respuesta fue exitosa
        if (response.ok) {
            window.location.href = '/login'; // Redirigimos al usuario a la página de inicio de sesión
        } else {
            alert('Error al cerrar sesión'); // Mostramos un mensaje de error si la respuesta no es exitosa
        }
    } catch (error) {
        alert('Error al conectar con el servidor'); // Mensaje de error si ocurre un problema en la conexión
    }
});
