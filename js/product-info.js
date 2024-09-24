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
                    <div><strong>Usuario:</strong> ${comment.user}</div>
                    <div><strong>Puntuación:</strong> ${comment.score} Estrellas</div>
                    <div><strong>Fecha:</strong> ${comment.dateTime}</div>
                    <div><strong>Descripción:</strong> ${comment.description}</div>
                    <hr>
                `;
                commentsContainer.appendChild(commentElement);
            });
        })
        .catch(error => {
            console.error('Hubo un problema con la operación fetch:', error);
        });
});