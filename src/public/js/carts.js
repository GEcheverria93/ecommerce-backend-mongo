/* eslint-disable no-alert */
/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
document.addEventListener('DOMContentLoaded', () => {
    const clearAllButton = document.getElementById('btn-clear-all');

    // Eliminar todos los carritos
    clearAllButton?.addEventListener('click', async () => {
        const confirmation = confirm(
            '¿Estás seguro de que deseas eliminar todos los carritos?'
        );
        if (confirmation) {
            try {
                const response = await fetch('/api/carts', {
                    method: 'DELETE',
                });
                if (response.ok) {
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    alert('Error al eliminar todos los carritos');
                }
            } catch (error) {
                console.error('Error al eliminar todos los carritos:', error);
            }
        }
    });

    // Aumentar la cantidad de un producto
    document.querySelectorAll('.btn-increase').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const { cartId } = event.target.dataset;
            const { productId } = event.target.dataset;

            try {
                const response = await fetch(
                    `/api/carts/${cartId}/product/${productId}`,
                    {
                        method: 'POST',
                    }
                );
                if (response.ok) {
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    alert('Error al aumentar la cantidad del producto');
                }
            } catch (error) {
                console.error(
                    'Error al aumentar la cantidad del producto:',
                    error
                );
            }
        });
    });

    // Disminuir la cantidad de un producto
    document.querySelectorAll('.btn-decrease').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const { cartId } = event.target.dataset;
            const { productId } = event.target.dataset;

            try {
                // Obtener la cantidad actual del producto
                const quantityElement = event.target
                    .closest('li')
                    .querySelector('span.quantity');
                const currentQuantity = parseInt(
                    quantityElement.textContent,
                    10
                );

                // Si la cantidad es mayor a 1, disminuir
                if (currentQuantity > 1) {
                    const response = await fetch(
                        `/api/carts/${cartId}/products/${productId}`,
                        {
                            method: 'PUT',
                            body: JSON.stringify({
                                quantity: currentQuantity - 1,
                            }), // Decrementar en 1
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        }
                    );
                    if (response.ok) {
                        location.reload(); // Recargar la página para ver los cambios
                    } else {
                        alert('Error al disminuir la cantidad del producto');
                    }
                } else {
                    // Si la cantidad es 1, eliminar el producto
                    const response = await fetch(
                        `/api/carts/${cartId}/products/${productId}`,
                        {
                            method: 'DELETE',
                        }
                    );
                    if (response.ok) {
                        location.reload(); // Recargar la página para ver los cambios
                    } else {
                        alert('Error al eliminar el producto del carrito');
                    }
                }
            } catch (error) {
                console.error(
                    'Error al disminuir la cantidad del producto:',
                    error
                );
            }
        });
    });

    // Eliminar un producto del carrito
    document.querySelectorAll('.btn-remove').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const { cartId } = event.target.dataset;
            const { productId } = event.target.dataset;

            try {
                const response = await fetch(
                    `/api/carts/${cartId}/products/${productId}`,
                    {
                        method: 'DELETE',
                    }
                );
                if (response.ok) {
                    location.reload(); // Recargar la página para ver los cambios
                } else {
                    alert('Error al eliminar el producto del carrito');
                }
            } catch (error) {
                console.error(
                    'Error al eliminar el producto del carrito:',
                    error
                );
            }
        });
    });

    // Eliminar un carrito
    document.querySelectorAll('.btn-delete-cart').forEach((button) => {
        button.addEventListener('click', async (event) => {
            const { cartId } = event.target.dataset;

            const confirmation = confirm(
                '¿Estás seguro de que deseas eliminar este carrito?'
            );
            if (confirmation) {
                try {
                    const response = await fetch(`/api/carts/${cartId}`, {
                        method: 'DELETE',
                    });
                    if (response.ok) {
                        location.reload(); // Recargar la página para ver los cambios
                    } else {
                        alert('Error al eliminar el carrito');
                    }
                } catch (error) {
                    console.error('Error al eliminar el carrito:', error);
                }
            }
        });
    });
});
