document.addEventListener("DOMContentLoaded", function() {
    // Cargar información del producto
    const productId = localStorage.getItem('idProducto');
    
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

                // Insertar contenido en produ_espec
                document.getElementById("produ_espec").innerHTML = info1 + img + info2;

                // Inicializar el carrusel
                initializeCarousel();

                // Redireccionar al hacer clic en la categoría
                document.getElementById("categ").addEventListener('click', function() {
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
            currentIndex = (index + images.length) % images.length; // Asegura el índice dentro de los límites
            carouselContainer.style.transform = `translateX(-${currentIndex * 100}%)`;
        }

        document.querySelector('.carousel-button.next').addEventListener('click', () => {
            showImage(currentIndex + 1);
        });

        document.querySelector('.carousel-button.prev').addEventListener('click', () => {
            showImage(currentIndex - 1);
        });
    }

    // Cargar comentarios del producto
    fetch(`https://japceibal.github.io/emercado-api/products_comments/${productId}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
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
                commentsContainer.appendChild(createCommentElement(comment));
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });

    // Cargar productos relacionados
    fetch(`https://japceibal.github.io/emercado-api/cats_products/${localStorage.getItem('catID')}.json`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {
            if (data && data.products) {
                const filteredProducts = data.products.filter(product => product.id.toString() !== productId);
                displayImagesInRow(filteredProducts);
            }
        })
        .catch(error => {
            console.error('Error loading related products:', error);
        });

    // Mostrar imágenes de productos relacionados
    function displayImagesInRow(products) {
        const relatedContainer = document.getElementById('related-products');
        relatedContainer.innerHTML = ''; // Limpiar contenido anterior

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

    // Manejo de comentarios
    let btnEnviar = document.getElementById("button");
    let mi_comentario = document.getElementById("comentario");
    let puntuacion = 0;
    let selec_estrella = false;
    let estrellas = document.querySelectorAll("input[name='rating']");

    estrellas.forEach((estrella, index) => {
        estrella.addEventListener("click", function() {
            selec_estrella = true;
            puntuacion = index + 1;
        });
    });

    btnEnviar.addEventListener("click", function() {
        if (mi_comentario.value.trim() === "") {
            alert("Ingrese su comentario antes de publicarlo");
        } else if (!selec_estrella) {
            alert("Debe puntuar al producto antes de publicar su comentario");
        } else {
            const comentario = {
                description: mi_comentario.value.trim(),
                score: puntuacion,
                user: localStorage.getItem("username") || "Usuario Anónimo",
                dateTime: new Date().toLocaleString(),
                idProducto: localStorage.getItem('idProducto')
            };

            let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
            comentariosGuardados.push(comentario);
            localStorage.setItem('comentarios', JSON.stringify(comentariosGuardados));

            mostrarComentarios();

            mi_comentario.value = "";
            puntuacion = 0;
            selec_estrella = false;
            estrellas.forEach(estrella => estrella.checked = false);
        }
    });

    // Función para mostrar todos los comentarios
    function mostrarComentarios() {
        const commentsContainer = document.getElementById('products_comments');
        commentsContainer.innerHTML = '';

        fetch(`https://japceibal.github.io/emercado-api/products_comments/${productId}.json`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                if (data.length === 0) {
                    commentsContainer.innerHTML = '<p>No hay comentarios disponibles para este producto.</p>';
                } else {
                    data.forEach(comment => {
                        commentsContainer.appendChild(createCommentElement(comment));
                    });
                }

                // Mostrar comentarios guardados
                let comentariosGuardados = JSON.parse(localStorage.getItem('comentarios')) || [];
                comentariosGuardados.forEach(comment => {
                    if (comment.idProducto === productId) {
                        commentsContainer.appendChild(createCommentElement(comment));
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
    mostrarComentarios();
});


