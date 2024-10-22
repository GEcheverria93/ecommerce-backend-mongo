/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');

    // Escuchar el evento de envío del formulario
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        console.log('hola');

        // Obtener los valores de los campos del formulario
        const limit = document.getElementById('limit').value;
        const page = document.getElementById('page').value;
        const sort = document.getElementById('sort').value;
        const query = document.getElementById('query').value;

        // Construir la URL con los parámetros de consulta
        const url = `/?page=${page}&limit=${limit}&sort=${sort}&query=${query}`;

        // Redirigir a la URL construida
        window.location.href = url;
    });
});
