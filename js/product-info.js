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
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
