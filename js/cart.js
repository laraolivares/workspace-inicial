function setCatID(id) {
    localStorage.setItem("catID", id);
    window.location = "products.html";
}


function logout() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username;
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const productId = localStorage.getItem('idProducto');

    const cerrarSesion = document.getElementById("cerrarSesion"); 

                    // Cerrar sesion desde el dropdown menu
                    if (cerrarSesion) {
                        cerrarSesion.addEventListener('click', logout);
                    }

                });