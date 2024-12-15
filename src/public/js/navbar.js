/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
document.getElementById('logoutBtn')?.addEventListener('click', async () => {
    try {
        const response = await fetch('/api/sessions/logout', {
            method: 'POST',
        });

        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Error al cerrar sesión');
        }
    } catch (error) {
        alert('Error al conectar con el servidor');
    }
});
