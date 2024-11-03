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

// Función que se ejecuta cuando la ventana se carga
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
    updateBadge(); // Update badge on load
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
    updateBadge()
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
    updateBadge(); // Update badge after quantity change
}

// Reload the cart items visually
function updateCartVisual(cartItems) {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear current content

    if (cartItems.length === 0) {
        document.getElementById("empty-cart").style.display = "block"; // Show message if cart is empty
        return;
    }

    document.getElementById("empty-cart").style.display = "none"; // Hide message if there are products in the cart

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
    updateBadge(); // Update badge after item removal
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

//Calculo la cantidad de productos en carrito
// Function to update the badge with the total quantity of products in the cart

}


