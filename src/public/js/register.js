/* eslint-disable no-alert */
/* eslint-disable no-undef */
document
    .getElementById('registerForm')
    .addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            first_name: document.getElementById('first_name').value,
            last_name: document.getElementById('last_name').value,
            email: document.getElementById('email').value,
            age: parseInt(document.getElementById('age').value, 10),
            password: document.getElementById('password').value,
        };

        try {
            const response = await fetch('/api/sessions/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                window.location.href = '/login';
            } else {
                const error = await response.json();
                alert(error.message || 'Error en el registro');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    });
