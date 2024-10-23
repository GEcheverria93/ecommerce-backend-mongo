/* eslint-disable no-alert */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const filterForm = document.getElementById('filter-form');
    const cartIcon = document.getElementById('cart-icon');
    const cartDropdown = document.getElementById('cart-dropdown');
    let selectedCartId = 'nuevo'; // Por defecto, seleccionamos "Nuevo Carrito"

    // Escuchar el evento de envío del formulario
    filterForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevenir el comportamiento por defecto del formulario
        const limit = document.getElementById('limit').value;
        const page = document.getElementById('page').value;
        const sort = document.getElementById('sort').value;
        const query = document.getElementById('query').value;
        const url = `/?page=${page}&limit=${limit}&sort=${sort}&query=${query}`;
        window.location.href = url;
    });

    // Función para actualizar la cantidad de artículos en el carrito seleccionado
    async function updateCartCount(cartId) {
        try {
            const cartCountElement = document.getElementById('cart-count');

            // Si el carrito seleccionado es "Nuevo Carrito", establecer el contador en 0
            if (cartId === 'nuevo') {
                cartCountElement.textContent = 0; // Mostrar 0 artículos
                return; // Salir de la función
            }

            const response = await fetch(`/api/carts/${cartId}`); // Obtener los productos del carrito seleccionado
            const cart = await response.json();

            // Usar reduce para contar la cantidad total de productos en el carrito
            const cartCount = cart.reduce(
                (total, item) => total + item.quantity,
                0
            ); // Contar los productos en el carrito

            // Actualizar el contador en el ícono del carrito
            cartCountElement.textContent = cartCount; // Mostrar la cantidad total de artículos
        } catch (error) {
            console.error(
                'Error al obtener la cantidad de artículos del carrito:',
                error
            );
        }
    }

    async function loadCartList() {
        try {
            const response = await fetch('/api/carts'); // Llamar al endpoint de carritos
            const carts = await response.json();

            // Limpiar las opciones actuales
            const cartOptionsContainer =
                document.getElementById('cart-options');
            cartOptionsContainer.innerHTML = '';

            // Agregar la opción "Nuevo Carrito"
            const newCartOption = document.createElement('div');
            newCartOption.className = 'cart-option selected'; // Marcar como seleccionado
            newCartOption.setAttribute('data-cart-id', 'nuevo');
            newCartOption.textContent = 'Nuevo Carrito';
            cartOptionsContainer.appendChild(newCartOption);

            // Agregar las nuevas opciones de carrito
            carts.forEach((cart) => {
                const option = document.createElement('div');
                option.className = 'cart-option';
                option.setAttribute('data-cart-id', cart.id);
                option.textContent = `Carrito ID: ${cart.id}`;
                cartOptionsContainer.appendChild(option);
            });

            // Agregar el evento de clic a todas las opciones de carrito
            const cartOptions = document.querySelectorAll('.cart-option');
            cartOptions.forEach((option) => {
                option.addEventListener('click', async (event) => {
                    selectedCartId = event.target.getAttribute('data-cart-id');
                    cartDropdown.style.display = 'none'; // Ocultar el menú después de seleccionar

                    // Remover la clase 'selected' de todas las opciones
                    cartOptions.forEach((opt) =>
                        opt.classList.remove('selected')
                    );

                    // Agregar la clase 'selected' a la opción seleccionada
                    event.target.classList.add('selected');

                    await updateCartCount(selectedCartId); // Actualizar la cantidad al seleccionar un carrito
                });
            });
        } catch (error) {
            console.error('Error al cargar la lista de carritos:', error);
        }
    }

    // Llamar a la función para cargar la lista de carritos al inicio
    loadCartList();

    // Manejar el clic en el ícono del carrito
    cartIcon.addEventListener('click', () => {
        // Alternar el estado del dropdown
        cartDropdown.style.display =
            cartDropdown.style.display === 'block' ? 'none' : 'block';
    });

    // Manejar el clic en el botón "Añadir al carrito"
    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach((button) => {
        button.addEventListener('click', async () => {
            const productId = button.getAttribute('data-product-id');

            if (selectedCartId) {
                if (selectedCartId === 'nuevo') {
                    // Lógica para crear un nuevo carrito
                    try {
                        const response = await fetch('/api/carts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                products: [{ product: productId, quantity: 1 }],
                            }),
                        });
                        const result = await response.json();
                        if (response.ok) {
                            alert('Nuevo carrito creado y producto añadido');
                            await loadCartList(); // Actualizar la lista de carritos
                            selectedCartId = result._id; // Seleccionar automáticamente el nuevo carrito

                            // Marcar el nuevo carrito como seleccionado
                            const newCartOption = document.querySelector(
                                `.cart-option[data-cart-id="${selectedCartId}"]`
                            );
                            if (newCartOption) {
                                // Remover la clase 'selected' de todas las opciones
                                const cartOptions =
                                    document.querySelectorAll('.cart-option');
                                cartOptions.forEach((opt) =>
                                    opt.classList.remove('selected')
                                );

                                // Agregar la clase 'selected' al nuevo carrito
                                newCartOption.classList.add('selected');
                            }

                            await updateCartCount(selectedCartId); // Actualizar la cantidad del nuevo carrito
                        } else {
                            alert(
                                `Error al crear el carrito: ${result.message}`
                            );
                        }
                    } catch (error) {
                        console.error('Error al crear el carrito:', error);
                        alert('Error al crear el carrito. Inténtalo de nuevo.');
                    }
                } else {
                    // Lógica para añadir el producto al carrito existente
                    try {
                        const response = await fetch(
                            `/api/carts/${selectedCartId}/product/${productId}`,
                            {
                                method: 'POST',
                            }
                        );
                        const result = await response.json();
                        if (response.ok) {
                            alert('Producto añadido al carrito');
                            await updateCartCount(selectedCartId); // Actualizar la cantidad después de añadir el producto
                        } else {
                            alert(
                                `Error al añadir el producto: ${result.message}`
                            );
                        }
                    } catch (error) {
                        console.error(
                            'Error al añadir el producto al carrito:',
                            error
                        );
                        alert(
                            'Error al añadir el producto. Inténtalo de nuevo.'
                        );
                    }
                }
            } else {
                alert('Por favor, selecciona un carrito.');
            }
        });
    });
});
