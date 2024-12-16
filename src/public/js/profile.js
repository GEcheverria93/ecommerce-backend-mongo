/* eslint-disable no-alert */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('profileLogoutBtn');

    logoutBtn?.addEventListener('click', async () => {
        try {
            const response = await fetch('/api/sessions/logout', {
                method: 'POST',
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.message || 'Error al cerrar sesión');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al conectar con el servidor');
        }
    });
});
