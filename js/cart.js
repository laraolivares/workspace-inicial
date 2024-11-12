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

function updateBadge() {
    const carro = JSON.parse(localStorage.getItem('cart')) || []; 
    let contador_prod = 0; // Inicializar el contador

    carro.forEach(item => {
        if (item.quantity) { // Asegurar que hay cantidad antes de agregar
            contador_prod += item.quantity; // Sumar cantidades
        }
    });

    let badge = document.getElementById("badge");
    if (contador_prod > 0) {
        badge.classList.remove("visually-hidden"); // Show the badge
        badge.innerHTML = contador_prod; // Update the badge text
    } else {
        badge.classList.add("visually-hidden"); // Hide the badge if there are no items
    }
}

// Función para calcular el subtotal de los productos en el carrito
function calcularSubtotal() {
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    return cartItems.reduce((acumulador, item) => acumulador + item.cost * item.quantity, 0);
}

// Función para calcular el costo de envío
function calcularCostoEnvio(subtotal) {
    // Obtener el tipo de envío seleccionado (suponiendo que sean inputs de tipo radio)
    const tipoEnvioSeleccionado = document.querySelector('input[name="shippingType"]:checked');
    
    if (tipoEnvioSeleccionado) {
        const tasaEnvio = parseFloat(tipoEnvioSeleccionado.value);
        return subtotal * tasaEnvio;
    }

    return 0; // Si no se selecciona un tipo de envío, el costo es 0
}

// Función para actualizar los costos
function actualizarCostos() {
    const subtotal = calcularSubtotal(); // Asegúrate de que esta función esté calculando el subtotal correctamente
    const costoEnvio = calcularCostoEnvio(subtotal);
    const total = subtotal + costoEnvio;

    // Actualizar los valores en el HTML
    document.getElementById("subtotal").innerText = subtotal.toFixed(2);
    document.getElementById("shipping-cost").innerText = costoEnvio.toFixed(2);
    document.getElementById("total-cost").innerText = total.toFixed(2);
}

// Función para recalcular los costos cuando se cambia el tipo de envío
document.addEventListener("DOMContentLoaded", function () {
    // Asegurarse de que el cambio en el tipo de envío actualice los costos
    const tiposEnvio = document.querySelectorAll('input[name="shippingType"]');
    tiposEnvio.forEach(input => {
        input.addEventListener('change', function () {
            actualizarCostos(); // Actualizar los costos cuando se cambie el tipo de envío
        });
    });

    // Calcular los costos iniciales al cargar la página
    actualizarCostos();
});

// Función que se ejecuta cuando la ventana se carga
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
    updateBadge(); // Actualizar el badge al cargar la página
    actualizarCostos(); // Actualizar los costos al cargar la página
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

// Función para crear el elemento visual del producto en el carrito
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

// Función para agregar el producto en el carrito
function addToCart(newItem) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Chequear si el producto está en el carrito
    const existingIndex = cartItems.findIndex(item => item.id === newItem.id);
    
    if (existingIndex !== -1) {
        // Item existe, actualiza la cantidad
        console.log(`Updating quantity for ${newItem.name}`);
        cartItems[existingIndex].quantity += newItem.quantity;
    } else {
        // Item no existe, agrega al carrito
        console.log(`Adding new item ${newItem.name}`);
        cartItems.push(newItem);
    }
    
    // Guardar en el localStorage el carrito actualizado
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    // Actualizar representación visual del carrito
    updateCartVisual(cartItems);
    updateBadge(); // Actualizar badge
    actualizarCostos(); // Actualizar los costos
}

// Update the quantity and subtotal when it changes
function updateSubtotal(input, cost, index) {
    const quantity = parseInt(input.value);
    const cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (quantity > 0) {
        cartItems[index].quantity = quantity;
    } else {
        alert("Quantity must be at least 1.");
        input.value = 1; // Reset to 1
        cartItems[index].quantity = 1;
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartVisual(cartItems);
    updateBadge(); // Actualizar el badge después de cambiar la cantidad
    actualizarCostos(); // Actualizar los costos después de cambiar la cantidad
}

// Reload the cart items visually
function updateCartVisual(cartItems) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Limpiar el contenido actual

    if (cartItems.length === 0) {
        document.getElementById("empty-cart").style.display = "block"; // Mostrar mensaje si el carrito está vacío
        return;
    }

    document.getElementById("empty-cart").style.display = "none"; // Ocultar mensaje si hay productos en el carrito

    cartItems.forEach((item, index) => {
        const productElement = createProductElement(item, index);
        cartItemsContainer.appendChild(productElement);
    });
}

// Remove an item from the cart
function removeFromCart(index) {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    cartItems.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    updateCartVisual(cartItems);
    updateBadge(); // Actualizar badge después de eliminar un artículo
    actualizarCostos(); // Actualizar los costos después de eliminar un producto
}

// Placeholder function for future edit functionality
function editItem(index) {
    alert("Edit item feature is under development.");
}

// Function to test adding a product (for demonstration purposes)
function testAddingProduct() {
    const productToAdd = {
        id: '123', // Ensure this ID is unique for each product
        name: 'Example Product',
        description: 'This is an example product.',
        image: 'example.jpg',
        cost: 10.00,
        quantity: 1 // This is the quantity you want to add
    };

    // Call the function to add the product to the cart
    addToCart(productToAdd);
}


