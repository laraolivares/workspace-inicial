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
