document.addEventListener("DOMContentLoaded", function() {
    fetch('https://japceibal.github.io/emercado-api/products/' + localStorage.getItem('idProducto') + '.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos recibidos:', data);
            if (data) {
                var info1 = `<p id="categ">${data.category}</p>
                             <h1>${data.name}</h1>`;

                             
                let img = `<div id="carousel" class="carousel">
                               <button class="carousel-button prev">❮</button>
                               <div class="carousel-images">`;
                for (let i = 0; i < data.images.length; i++) {
                    img += `<img src="${data.images[i]}" alt="Product Image">`;
                }
                img += `</div>
                        <button class="carousel-button next">❯</button>
                    </div>`;

                var info2 = `<p id="descrip-corta">${data.description}</p>
                             <p id="precio">${data.currency} ${data.cost}</p>
                             <p id="categ-vendidos">${data.soldCount} vendidos</p>
                             <p id="descrip-larga">${data.longDescription || 'No hay una descripción extensa disponible para este producto.'}
                             `;


                // Insertar todo el contenido en produ_espec
                document.getElementById("produ_espec").innerHTML = info1 + img + info2;

                // Inicializar el carrusel después de cargar las imágenes
                initializeCarousel();

                // Redireccionar al hacer clic en la categoría
                document.getElementById("categ").addEventListener('click', function(){
                    window.location.href = 'products.html';


                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    // Función para inicializar el carrusel
    function initializeCarousel() {
        const carouselContainer = document.querySelector('#carousel .carousel-images');
        const images = carouselContainer.querySelectorAll('img');
        let currentIndex = 0;

        function showImage(index) {
            if (index >= images.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = images.length - 1;
            } else {
                currentIndex = index;
            }
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        document.querySelector('.carousel-button.next').addEventListener('click', () => {
            showImage(currentIndex + 1);
        });

        document.querySelector('.carousel-button.prev').addEventListener('click', () => {
            showImage(currentIndex - 1);
        });
    }
  
    const productId = localStorage.getItem('idProducto');
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productId}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const commentsContainer = document.getElementById('products_comments');
            commentsContainer.innerHTML = ''; // Limpiar contenido anterior

            if (data.length === 0) {
                commentsContainer.innerHTML = '<p>No hay comentarios disponibles para este producto.</p>';
                return;
            }


            data.forEach(comment => {
                const commentElement = document.createElement('div');
                commentElement.className = 'comentario';
                commentElement.innerHTML = `
                <div class="lista_comentarios">
                <div class = "lista_comentarios_1">    
                    <div class="p-2">
                     ${'<i class="fas fa-star"></i>'.repeat(comment.score)}${'<i class="far fa-star"></i>'.repeat(5 - comment.score)}                     </div>
                    <div class="p-2"> ${comment.user}</div>
                    <div class="ms-auto p-2"> ${comment.dateTime}</div>
                </div>
                <div class = "lista_comentarios_2">
                    <div> ${comment.description}</div>
                </div>
                </div>
                <hr>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
});

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
    
    let btnEnviar = document.getElementById("button");
let mi_comentario = document.getElementById("comentario");
let puntuacion = 0; // Inicializa puntuación
let selec_estrella = false;
let estrellas = document.querySelectorAll("input[name='rating']");

estrellas.forEach((estrella, index) => {
    estrella.addEventListener("click", function() {
        selec_estrella = true;
        puntuacion = index + 1; // Asigna la puntuación (1 a 5)
    });
});

btnEnviar.addEventListener("click", function() {
    if (mi_comentario.value.trim() === "") {
        alert("Ingrese su comentario antes de publicarlo");
    } else if (!selec_estrella) {
        alert("Debe puntuar al producto antes de publicar su comentario");
    } else {
        let comentario = {
            description: mi_comentario.value.trim(),
            score: puntuacion,
            user: localStorage.getItem("username") || "Usuario Anónimo",
            dateTime: new Date().toLocaleString(), // Fecha y hora actual
            idProducto: localStorage.getItem('idProducto') // Añadir idProducto
        };

        // Guardar el comentario en localStorage
        let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
        comentariosGuardados.push(comentario);
        localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));

        // Mostrar todos los comentarios
        mostrarComentarios();
        
        // Limpiar el comentario y la puntuación después de enviar
        mi_comentario.value = "";
        puntuacion = 0;
        selec_estrella = false;
        estrellas.forEach(estrella => estrella.checked = false); // Reiniciar estrellas
    }
});

// Función para mostrar todos los comentarios (fetch y localStorage)
function mostrarComentarios() {
    const commentsContainer = document.getElementById('products_comments');
    commentsContainer.innerHTML = ''; // Limpiar contenido anterior

    const currentIdProducto = localStorage.getItem('idProducto'); // Obtener el idProducto actual

    // Mostrar comentarios de la API
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${currentIdProducto}.json`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.length === 0) {
                commentsContainer.innerHTML = '<p>No hay comentarios disponibles para este producto.</p>';
            } else {
                data.forEach(comment => {
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                });
            }

            // Mostrar comentarios guardados en localStorage
            let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
            comentariosGuardados.forEach(comment => {
                // Solo mostrar comentarios que corresponden al idProducto actual
                if (comment.idProducto === currentIdProducto) {
                    const commentElement = createCommentElement(comment);
                    commentsContainer.appendChild(commentElement);
                }
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
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

// Llamar a la función para mostrar comentarios al cargar la página
mostrarComentarios()

    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

