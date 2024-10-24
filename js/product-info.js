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
    
    fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data) {
                const info1 = `<p id="categ">${data.category}</p>
                               <h1>${data.name}</h1>`;
                let img = `<div id="carousel" class="carousel">
                               <button class="carousel-button prev">❮</button>
                               <div class="carousel-images">`;

                data.images.forEach(image => {
                    img += `<img src="${image}" alt="Product Image">`;
                });

                img += `</div>
                        <button class="carousel-button next">❯</button>
                    </div>`;
                
                const info2 = `<p id="descrip-corta">${data.description}</p>
                               <p id="precio">${data.currency} ${data.cost}</p>
                               <p id="categ-vendidos">${data.soldCount} vendidos</p>
                               <p id="descrip-larga">${data.longDescription || 'No hay una descripción extensa disponible para este producto.'}</p>`;

                document.getElementById("produ_espec").innerHTML = info1 + img + info2;

                initializeCarousel();
                document.getElementById("categ").addEventListener('click', function() {
                    window.location.href = 'products.html';

                    
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    function initializeCarousel() {
        const carouselContainer = document.querySelector('#carousel .carousel-images');
        const images = carouselContainer.querySelectorAll('img');
        let currentIndex = 0;

        function showImage(index) {
            currentIndex = (index + images.length) % images.length;
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        document.querySelector('.carousel-button.next').addEventListener('click', () => {
            showImage(currentIndex + 1);
        });

        document.querySelector('.carousel-button.prev').addEventListener('click', () => {
            showImage(currentIndex - 1);
        });
    }

    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            const commentsContainer = document.getElementById('products_comments');
            commentsContainer.innerHTML = '';

            if (data.length === 0) {
                commentsContainer.innerHTML = '<p>No hay comentarios disponibles para este producto.</p>';
                return;
            }

            data.forEach(comment => {
                commentsContainer.appendChild(createCommentElement(comment));
            });
            mostrarComentarios();  // Mostrar comentarios guardados en el localStorage al cargar la página
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
        
        

    function displayImagesInRow(products) {
        const relatedContainer = document.getElementById('related-products');
        relatedContainer.innerHTML = '';

        const imgContainer = document.createElement('div');
        imgContainer.className = 'related-container';

        products.forEach((product, index) => {
            const imageDiv = document.createElement('div');
            imageDiv.className = 'related-image';

            const imgElement = document.createElement('img');
            imgElement.src = product.image;
            imgElement.alt = `Image ${index + 1}`;
            imgElement.addEventListener('click', () => {
                localStorage.setItem('idProducto', product.id);
                window.location.href = 'product-info.html';
            });

            const imgTitle = document.createElement('p');
            imgTitle.textContent = product.name;
            imgTitle.className = 'img-title';

            imageDiv.appendChild(imgElement);
            imageDiv.appendChild(imgTitle);
            imgContainer.appendChild(imageDiv);
        });

        relatedContainer.appendChild(imgContainer);
    }

const excludedProductId = localStorage.getItem('idProducto'); // Ensure this is a string

fetch("https://japceibal.github.io/emercado-api/cats_products/" + localStorage.getItem('catID') + ".json")
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // Convert the response to JSON
    })
    .then(data => {
        if (data && data.products) {
            const products = data.products; // Save products locally

            // Exclude the product with the specified ID
            const excludedProductId = localStorage.getItem('idProducto'); // Assuming this is how you get the ID to exclude
            const filteredProducts = products.filter(product => product.id.toString() !== excludedProductId);

            displayImagesInRow(filteredProducts); // Call to display images without the excluded product

            function displayImagesInRow(products) {
                // Clear existing related products if needed
                const relatedContainer = document.getElementById('related-products');
                relatedContainer.innerHTML = ''; // Clear previous content

                // Create a container for the images
                const imgContainer = document.createElement('div');
                imgContainer.className = 'related-container'; // Add class for styling

                // Create image elements and append to the container
                products.forEach((product, index) => {
                    const imageDiv = document.createElement('div');
                    imageDiv.className = 'related-image'; // Add class for styling

                    const imgElement = document.createElement('img');
                    imgElement.src = product.image; // Use the source from the product object
                    imgElement.alt = `Image ${index + 1}`; // Use a generic alt text or modify as needed


                    const imgTitle = document.createElement('p');
                    imgTitle.textContent= product.name;
                    imgTitle.className = 'img-title';

                    // Add a click event listener to save the product ID to local storage
                    imgElement.addEventListener('click', () => {
                        localStorage.setItem('idProducto', product.id); // Save the clicked product's ID
                        window.location.href = 'product-info.html';
                    });

                    imageDiv.appendChild(imgElement);
                    imageDiv.appendChild(imgTitle);
                    imgContainer.appendChild(imageDiv);
                });

                // Append the image container to the specified element
                relatedContainer.appendChild(imgContainer);
            }
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

        let btnEnviar = document.getElementById("button");
        let mi_comentario = document.getElementById("comentario");
        let puntuacion = 0; // Inicializa puntuación
        let estrellas = [];
    
        // Obtener las estrellas
        for (let i = 1; i <= 5; i++) {
            estrellas.push(document.getElementById("star-" + i));
        }
    
        // Asignar evento a las estrellas
        estrellas.forEach((estrella, index) => {
            estrella.addEventListener("click", function() {
                puntuacion = index + 1; // Asigna la puntuación correctamente
            });
        });
    
        // Evento para enviar el comentario
        btnEnviar.addEventListener("click", function() {
            if (mi_comentario.value.trim() === "") {
                alert("Ingrese su comentario antes de publicarlo");
            } else if (puntuacion === 0) {
                alert("Debe puntuar al producto antes de publicar su comentario");
            } else {
                const comentario = {
                    description: mi_comentario.value.trim(),
                    score: puntuacion,
                    user: localStorage.getItem("username") || "Usuario Anónimo",
                    dateTime: new Date().toLocaleString(),
                    idProducto: localStorage.getItem('idProducto')
                };
    
                // Guardar comentario en localStorage
                let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
                comentariosGuardados.push(comentario);
                localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));
    
                // Limpiar el campo de texto
                mi_comentario.value = " "; 
                puntuacion = 0; // Reiniciar puntuación
                estrellas.forEach(star => star.checked = false); // Reiniciar estrellas
    
                mostrarComentarios(); // Mostrar comentarios después de añadir uno nuevo
            }
        });
    
        // Función para mostrar comentarios
        function mostrarComentarios() {
            const commentsContainer = document.getElementById('products_comments');
    
            // Obtener comentarios guardados en localStorage
            let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
            
            // Filtrar y mostrar comentarios del producto actual
            comentariosGuardados.forEach(comment => {
                if (comment.idProducto === localStorage.getItem('idProducto')) {
                    commentsContainer.appendChild(createCommentElement(comment));
                }
            });
        }
    
        // Función para crear el elemento de comentario
        function createCommentElement(comment) {
            const commentElement = document.createElement('div');
            commentElement.className = 'comentario';
            commentElement.innerHTML = `
                <div class="lista_comentarios">
                    <div class="lista_comentarios_1">    
                        <div class="p-2">
                            ${'<i class="fas fa-star"></i>'.repeat(comment.score)}${'<i class="far fa-star"></i>'.repeat(5 - comment.score)}
                        </div>
                        <div class="p-2">${comment.user}</div>
                        <div class="ms-auto p-2">${comment.dateTime}</div>
                    </div>
                    <div class="lista_comentarios_2">
                        <div>${comment.description}</div>
                    </div>
                </div>
                <hr>
            `;
            return commentElement;
        }
    });
    
    
    const bdark = document.querySelector('#bdark');
    const body = document.querySelector('body');

    load();

    bdark.addEventListener('click', () => {
        const isDarkMode = body.classList.toggle('darkmode');
        store(isDarkMode);
        bdark.textContent = isDarkMode ? 'Modo claro' : 'Modo oscuro'; // Cambia el texto del botón
    });
    
    function load() {
        const darkmode = localStorage.getItem('darkmode');
        if (darkmode === 'true') {
            body.classList.add('darkmode');
            bdark.textContent = 'Modo claro'; // Cambia el texto si está en modo oscuro
        } else {
            store('false'); // Guarda como 'false' si no hay nada
        }
    }

    // Para guardar el modo oscuro en localStorage    
    function store(value){
        localStorage.setItem('darkmode', value);
    }


// BOTÓN COMPRAR
document.addEventListener("DOMContentLoaded", function() {
   
    const comprarBtn = document.getElementById("comprar-btn");

    if (comprarBtn) {
        comprarBtn.addEventListener("click", function() {

        const productId = localStorage.getItem('idProducto');
        const cantidadInput = document.getElementById('cantidad');

        if (!cantidadInput) {
            console.error("Campo de cantidad no encontrado.");
            return;
        }

        const cantidad = parseInt(cantidadInput.value); // Convertir el valor de cantidad a número

    // Verificar que la cantidad sea válida
        if (isNaN(cantidad) || cantidad < 1) {
            console.error("Cantidad inválida.");
            return;
        }

    fetch(`https://japceibal.github.io/emercado-api/products/${productId}.json`)
        .then(response => response.json())
        .then(data => {

    // Crear objeto con la información del producto
        const productToCart = {
        id: data.id,
        name: data.name,
        currency: data.currency,
        cost: data.cost,
        image: data.images[0], 
        quantity: cantidad, 
        subtotal: data.cost * cantidad 
        };

    // Obtener el carrito guardado en localStorage o crear uno nuevo
        let cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Añadir el producto al carrito
        cart.push(productToCart);

    // Guardar el carrito actualizado en localStorage
        localStorage.setItem('cart', JSON.stringify(cart));

    // Redirigir a la página del carrito
        window.location.href = 'cart.html';
        })
        .catch(error => {
        console.error('Error al agregar el producto al carrito:', error);
        });
    });
    } else {
        console.error("Botón 'Comprar' no encontrado en el DOM.");
    }
});
