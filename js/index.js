document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("autos").addEventListener("click", function() {
        localStorage.setItem("catID", 101);
        window.location = "products.html";
    });
    document.getElementById("juguetes").addEventListener("click", function() {
        localStorage.setItem("catID", 102);
        window.location = "products.html";
    });
    document.getElementById("muebles").addEventListener("click", function() {
        localStorage.setItem("catID", 103);
        window.location = "products.html";
    });

    const cerrarSesion = document.getElementById("cerrarSesion"); 

    // Cerrar sesion desde el dropdown menu
    if (cerrarSesion) {
        cerrarSesion.addEventListener('click', logout);
    }
    updateBadge();
});

window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const nombreUsuario = localStorage.getItem('username');
        if (nombreUsuario) {
            document.getElementById('username').textContent = nombreUsuario;
        }
    }
};

function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

function updateBadge() {
    const carro = JSON.parse(localStorage.getItem('cart')) || []; // Parse the JSON string or use an empty array
    let contador_prod = 0; // Initialize the counter

    carro.forEach(item => {
        if (item.quantity) { // Ensure quantity exists before adding
            contador_prod += item.quantity; // Sum the quantities
        }
    });

    let badge = document.getElementById("badge");
    if (contador_prod > 0) {
        badge.classList.remove("visually-hidden"); // Show the badge
        badge.innerHTML = contador_prod; // Update the badge text
    } else {
        badge.classList.add("visually-hidden"); // Hide the badge if there are no items
    }

    console.log(contador_prod);
}