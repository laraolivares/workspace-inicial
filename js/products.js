document.addEventListener("DOMContentLoaded", function() {
    fetch('https://japceibal.github.io/emercado-api/cats_products/101.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // Convierte la respuesta a JSON
        })
        .then(data => {
            console.log('Datos recibidos:', data); // Verifica toda la estructura del JSON
            if (data && data.products) {
                for (let i = 0; i < data.products.length; i++) {
                    const product = data.products[i];
                    
                    // Establecer el contenido para el elemento de producto
                    const productTitle = document.getElementById("autoTitulo" + (i + 1));
                    const productElement = document.getElementById("auto" + (i + 1));
                    const productSales = document.getElementById("autoVentas" + (i + 1));
                    if (productElement) {
                        productTitle.innerHTML = product.name ;
                        productElement.innerHTML = product.description + `<br>`
                        + `<br>` +`<strong>` + product.currency + " " + product.cost + ` </strong>`;
                        productSales.innerHTML = product.soldCount + " vendidos";
                    } else {
                        console.error(`Elemento con ID "auto${i + 1}" no encontrado`);
                    }


                    // Establecer el src para la imagen si el elemento es una imagen
                    const imgElement = document.getElementById("img.auto" + (i + 1));
                    if (imgElement) {
                        imgElement.src = product.image;
                    } else {
                        console.error(`Elemento de imagen con ID "img${i + 1}" no encontrado`);
                    }
                }
            } else {
                console.error('La propiedad products no está disponible en los datos:', data);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Maneja cualquier error
        });
});

                    
window.onload = function() {
    const estaLogueado = localStorage.getItem('loggedIn');
    if (!estaLogueado) {
        window.location.href = 'login.html';
    } else {
        const username = localStorage.getItem('username');
        document.getElementById("username").innerHTML = username ;
    }
};

// FUNCIÓN PARA LA BÚSQUEDA EN TIEMPO REAL
function realizarBusqueda() {
    const buscador = document.getElementById('buscador');
    const textoMinuscula = buscador.value.toLowerCase(); // Obtiene el texto de búsqueda en minúsculas
    const productos = document.querySelectorAll('.producto'); // Selecciona todos los elementos con la clase 'producto'

    productos.forEach(producto => {
        const titulo = producto.querySelector('.autoTitulo').textContent.toLowerCase(); // Obtiene y convierte el título a minúsculas
        const descripcion = producto.querySelector('.auto').textContent.toLowerCase(); // Obtiene y convierte la descripción a minúsculas

        // Muestra el producto si el texto de la búsqueda está en el título o en la descripción
        if (titulo.includes(textoMinuscula) || descripcion.includes(textoMinuscula)) {
            producto.style.display = ''; // Muestra el producto
        } else {
            producto.style.display = 'none'; // Oculta el producto
        }
    });
}

document.getElementById('buscador').addEventListener('input', realizarBusqueda);

document.getElementById('lupa').addEventListener('click', realizarBusqueda);

