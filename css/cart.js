// Función para establecer el ID de la categoría y redirigir a la página de productos
function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}

// Función para cerrar sesión
function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Función que se ejecuta cuando la ventana se carga
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
};

// Cerrar sesión desde el menú desplegable
document.addEventListener("DOMContentLoaded", () => {
    const cerrarSesion = document.getElementById("cerrarSesion");
    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', logout);
    }

    // Cargar y renderizar los artículos del carrito al cargar la página
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    updateCartVisual(cartItems);
});

// Función para crear el elemento visual de un producto en el carrito
function createProductElement(item, index) {
    const productElement = document.createElement("div");
    productElement.className = "cart-item mb-4";
    productElement.innerHTML = `
        <div class="cart-card">
            <img src="${item.image}" class="product-image" alt="${item.name}">
            <div class="product-details">
                <h5 class="product-title">${item.name}</h5>
                <p class="product-info">${item.description}</p> 
                <p class="product-quantity">Cantidad: 
                    <input type="number" value="${item.quantity}" min="1" class="quantity-input"
                        onchange="updateSubtotal(this, ${item.cost}, ${index})">
                </p>
            </div>
            <div class="product-price-actions">
                <p class="product-price">$${(item.cost * item.quantity).toFixed(2)}</p>
                <button class="edit-button" onclick="editItem(${index})">
                    <i class="fa fa-pencil"></i>
                </button>
                <button class="delete-button" onclick="removeFromCart(${index})">
                    <i class="fa fa-trash"></i>
                </button>
            </div>
        </div>
    `;
    return productElement;
}

// Actualiza la cantidad y el subtotal cuando cambia la cantidad
function updateSubtotal(input, cost, index) {
    const quantity = parseInt(input.value);
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems[index].quantity = quantity;
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartVisual(cartItems);
}

// Recarga los artículos del carrito visualmente
function updateCartVisual(cartItems) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Limpiar contenido actual

    if (cartItems.length === 0) {
        document.getElementById("empty-cart").style.display = "block"; // Mostrar mensaje si el carrito está vacío
        return;
    }

    document.getElementById("empty-cart").style.display = "none"; // Ocultar mensaje si hay productos en el carrito
    let total = 0;

    cartItems.forEach((item, index) => {
        const productElement = createProductElement(item, index);
        cartItemsContainer.appendChild(productElement);
        total += item.cost * item.quantity;
    });
}

// Eliminar un artículo del carrito
function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartVisual(cartItems);
}

// Función de marcador de posición para la futura funcionalidad de edición
function editItem(index) {
    alert("Edit item feature is under development.");
}
